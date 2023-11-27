import config from "../config/config.click2call.json";
import c2cstyle from "../style/click2call.css";

const handleClickToCall = (phoneNumber, name) => {
  try {
    const basePath = `https://wapp.callindex.co.il/ClickToCall`;
    console.log(basePath, 'basePath')
    const c2cConf = {
      ...config,
      callerName: name || config.callerName,
      toNumber: phoneNumber || config.toNumber,
    };

    let outgoingSession; // call session container
    const c2csipFilePath = `${basePath}/js/sip-0.20.0.min.js`;
    const c2cringtonePath = `${basePath}/media/Tone_EarlyMedia-US.mp3`;
    const clickToCallBtnIdPro = "click2call-button";
    const clickToCallBoxPro = "click2call-box";
    const remoteAudioProEl = "remoteAudio";
    const c2cHangupBtnPro = "hangup-button";
    const c2cCallTitlePro = "c2c-call-title";
    const c2cCallStatusPro = "c2c-call-status";
    const c2cFooterTxtPro = "c2c-footer-text";
    const c2cCallTimerPro = "c2c-call-timer";
    let rinnger;

    const handleClose = () => {
      if (outgoingSession) {
        outgoingSession.dispose();
        outgoingSession = undefined;
      }
    };

    const c2cbtnUi = `<div class="vsplmainbox">
      <button class="vschatbox-open vsplbutton" id="${clickToCallBtnIdPro}">
        <img src="${basePath}/image/call-icon.png" width="24px">
      </button>
      <section class="vschatbox-popup" id="${clickToCallBoxPro}">
        <span class="vschatbox-popup__header">
        </span>
        <div class="vschatbox-popup__main">
          <div class="vsprofile_pic">
            <img src="${basePath}/image/calling.gif" width="100%" height="100%">
          </div>
          <div class="vsprofile_title">
            <audio id="${remoteAudioProEl}" controls></audio>
            <h1 id="${c2cCallTitlePro}">Austin</h1>
            <div id="${c2cCallStatusPro}">Agent (Online)</div>
            <div id="${c2cCallTimerPro}">00:00:00</div>
          </div>
          <button class="vscalling_btn vsplbutton" id="${c2cHangupBtnPro}">
            <img src="${basePath}/image/call.png" width="20px">
          </button>
        </div>
        <div class="vsfooter down-arrow">
          <p id="${c2cFooterTxtPro}"></p>
        </div>
      </section>
    </div>`;

    const beforeUnloadListener = (event) => {
      try {
        event.preventDefault();
        return (event.returnValue = "Are you sure you want to exit?");
      } catch (err) {
        console.log("error in beforeUnloadListener ", err);
      }
    };

    if (!c2cConf) {
      console.log("config not found!");
      return;
    }
    let c2cTimer;

    //  add  css
    document.head.innerHTML += c2cstyle;
    //  add ui
    document.body.innerHTML += c2cbtnUi;

    let click2callButton = c2cGetElementById(clickToCallBtnIdPro);
    let click2callBox = c2cGetElementById(clickToCallBoxPro);
    let remoteAudio = c2cGetElementById(remoteAudioProEl);
    let hangupButton = c2cGetElementById(c2cHangupBtnPro);
    let callerName = c2cGetElementById(c2cCallTitlePro);
    let callStatus = c2cGetElementById(c2cCallStatusPro);
    let c2cFooterTxt = c2cGetElementById(c2cFooterTxtPro);
    let c2cCallTimer = c2cGetElementById(c2cCallTimerPro);

    // get element by id
    const c2cGetElementById = (id) => document.getElementById(id);

    const c2cRinngerHandler = () => {
      try {
        rinnger = new Audio(c2cringtonePath);
        rinnger.preload = "auto";
        rinnger.loop = true;
        rinnger.oncanplaythrough = (e) => {
          if (typeof rinnger.sinkId !== "undefined") {
            rinnger
              .setSinkId("default")
              .then(() => {})
              .catch((e) => {
                console.warn("Failed not apply setSinkId.", e);
              });
          }
        };
      } catch (err) {
        console.log("error in c2cRinngerHandler", err);
      }
    };

    const c2cplayRinnger = () => {
      try {
        if (!rinnger) return;
        rinnger
          .play()
          .then(() => {})
          .catch((e) => {
            console.warn("Unable to play audio file.", e);
          });
      } catch (err) {
        console.log("error in c2cplayRinnger ", err);
      }
    };

    const c2cpauseRinnger = () => {
      try {
        rinnger.pause();
      } catch (error) {
        console.log("error in c2cpauseRinnger ", error);
      }
    };

    const c2cStartTimer = () => {
      try {
        let second = 0;
        c2cTimer = setInterval(() => {
          second += 1;
          c2cCallTimer.innerText = formatSeconds(second);
        }, 1000);
      } catch (err) {
        console.log("error in c2cStartTimer ", err);
      }
    };

    const c2cEndTimer = () => {
      try {
        clearInterval(c2cTimer);
        c2cCallTimer.innerText = "00:00:00";
      } catch (err) {
        console.log("error in c2cEndTimer ", err);
      }
    };

    const formatSeconds = (seconds) => {
      try {
        var date = new Date(1970, 0, 1);
        date.setSeconds(seconds);
        return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
      } catch (error) {
        console.log("error in formatSeconds ", error);
      }
    };

    const getLocalStream = async () => {
      console.log(navigator);

      if (navigator?.mediaDevices?.getUserMedia) {
        console.log(
          await navigator?.mediaDevices?.getUserMedia({ audio: true })
        );
        return await new Promise((resolve, reject) => {
          navigator?.mediaDevices
            ?.getUserMedia({ audio: true })
            .then(() => resolve(true))
            .catch((err) => resolve(false));
        });
      } else {
        console.log("getUserMedia : missing");
        return false;
      }
    };
    //  set footer text
    c2cFooterTxt.innerHTML = c2cConf.footer;

    //  create sip script
    const create_sip_script = document.createElement("script");
    create_sip_script.setAttribute("src", c2csipFilePath);
    document.body.appendChild(create_sip_script);

    create_sip_script.onload = async () => {
      try {
        const { Inviter, Registerer, SessionState, UserAgent } = SIP;

        let SipUsername = c2cConf.SipUsername;
        let wssServer = c2cConf.wssServer;
        let SipPassword = c2cConf.SipPassword;
        let WebSocketPort = c2cConf.WebSocketPort;
        let toNumber = c2cConf.toNumber;
        let target = UserAgent.makeURI("sip:" + toNumber + "@" + wssServer);
        c2cRinngerHandler();

        const transportOptions = {
          server: "wss://" + wssServer + ":" + WebSocketPort,
        };

        const uri = UserAgent.makeURI("sip:" + SipUsername + "@" + wssServer);
        const userAgentOptions = {
          authorizationPassword: SipPassword,
          authorizationUsername: SipUsername,
          transportOptions,
          uri,
        };

        const userAgent = new UserAgent(userAgentOptions);

        const registerer = new Registerer(userAgent);

        userAgent.start().then(async () => {
          try {
            let uaregister = await registerer.register();
            click2callButton.style.display = "none";
            uaregister.delegate.onAccept = () => {
              try {
                click2callButton.style.backgroundColor = "#31b931";
                click2callButton.style.display = "block";
              } catch (error) {
                console.log("error in uaregister.delegate.onAccept ", error);
              }
            };
            uaregister.delegate.onReject = () => {
              try {
                click2callButton.style.backgroundColor = "#f44336";
                click2callButton.style.display = "none";
              } catch (error) {
                console.log("error in uaregister.delegate.onReject ", error);
              }
            };

            click2callButton.addEventListener("click", async () => {
              try {
                if (outgoingSession) return;
                let checkMicPermission = await getLocalStream();
                if (!checkMicPermission) {
                  alert(
                    "׳™׳© ׳׳׳©׳¨ ׳׳× ׳”׳׳™׳§׳¨׳•׳₪׳•׳ ׳‘׳”׳’׳“׳¨׳•׳× ׳”׳“׳₪׳“׳₪׳"
                  );
                  return;
                }
                window.addEventListener("beforeunload", beforeUnloadListener, {
                  capture: true,
                });

                callerName.innerText = c2cConf.callerName;
                callStatus.innerText = "Calling";
                click2callBox.style.display = "block";

                // Send an outgoing INVITE request

                if (!target) {
                  throw new Error("Failed to create target URI.");
                }

                // Create a new Inviter
                const inviterOptions = {
                  media: {
                    remote: {
                      audio: remoteAudio,
                    },
                  },
                };
                outgoingSession = new Inviter(
                  userAgent,
                  target,
                  inviterOptions
                );

                //

                outgoingSession
                  .invite()
                  .then(() => {
                    console.log("call send");
                  })
                  .catch((error) => {
                    console.log("error in outgoingSession.invite >>> ", error);
                  });

                // Handle outgoing session state changes.
                outgoingSession.stateChange.addListener((newState) => {
                  try {
                    switch (newState) {
                      case SessionState.Establishing:
                        callStatus.innerText = "Ringing";
                        hangupButton.value = 0;
                        c2cplayRinnger();
                        break;
                      case SessionState.Established:
                        callStatus.innerText = "Answered";
                        hangupButton.value = 1;
                        remoteAudio.srcObject =
                          outgoingSession._sessionDescriptionHandler._remoteMediaStream;
                        remoteAudio.play();
                        c2cpauseRinnger();
                        c2cStartTimer();
                        break;
                      case SessionState.Terminated:
                        c2cpauseRinnger();
                        c2cEndTimer();
                        click2callBox.style.display = "none";
                        outgoingSession = undefined;
                        window.removeEventListener(
                          "beforeunload",
                          beforeUnloadListener,
                          { capture: true }
                        );
                        break;
                      default:
                        break;
                    }
                  } catch (err) {
                    console.log(
                      "error in outgoingSession.stateChange.addListener >>> newState >>> ",
                      err
                    );
                  }
                });

                /* Hungup call event */
                hangupButton.addEventListener("click", () => {
                  try {
                    if (!outgoingSession) return;
                    if (hangupButton.value == 1) {
                      outgoingSession.bye();
                      outgoingSession = undefined;
                    } else {
                      outgoingSession.dispose();
                      outgoingSession = undefined;
                    }
                  } catch (err) {
                    console.log(
                      "error in hangupButton.addEventListener >>> click >>> ",
                      err
                    );
                  }
                });
              } catch (err) {
                console.log(
                  "error in click2callButton.addEventListener >>> beforeunload >>> ",
                  err
                );
              }
            });
          } catch (error) {
            console.log("error in userAgent.start ", error);
          }
        });
      } catch (err) {
        console.log("error in create_sip_script.onload ", err);
      }
    };
    window.addEventListener("unload", (e) => {
      console.log("unload");
      try {
        if (!outgoingSession) return;
        handleClose();
      } catch (err) {
        console.log("error in window.addEventListener >>> unload >>> ", err);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export default handleClickToCall;

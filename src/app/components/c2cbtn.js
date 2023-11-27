/* eslint-disable @next/next/no-img-element */
import React from "react";

const C2cbtn = props => {
  const {
    basePath,
    remoteAudioProEl,
    clickToCallBtnIdPro,
    clickToCallBoxPro,
    c2cCallTitlePro,
    c2cCallStatusPro,
    c2cCallTimerPro,
    c2cFooterTxtPro,
    c2cHangupBtnPro,
  } = props;

  return <div className="vsplmainbox">
        <button className="vschatbox-open vsplbutton" id={`${clickToCallBtnIdPro}`}>
          <img src={`${basePath}/image/call-icon.png`} width="24px" alt=""/>
        </button>
        <section className="vschatbox-popup" id={`${clickToCallBoxPro}`}>
          <span className="vschatbox-popup__header"></span>
          <div className="vschatbox-popup__main">
            <div className="vsprofile_pic">
              <img
                src={`${basePath}/image/calling.gif`}
                width="100%"
                height="100%"
                alt=""
              />
            </div>
            <div className="vsprofile_title">
              <audio id={`${remoteAudioProEl}`} controls></audio>
              <h1 id={`${c2cCallTitlePro}`}>Austin</h1>
              <div id={`${c2cCallStatusPro}`}>Agent (Online)</div>
              <div id={`${c2cCallTimerPro}`}>00:00:00</div>
            </div>
            <button className="vscalling_btn vsplbutton" id={`${c2cHangupBtnPro}`}>
              <img src={`${basePath}/image/call.png`} width="20px" alt=""/>
            </button>
          </div>
          <div className="vsfooter down-arrow">
            <p id={`${c2cFooterTxtPro}`}></p>
          </div>
        </section>
      </div>
};

export default C2cbtn

import axios from "axios";

const activatePhoneNumber = async (phoneNumber: String) => {
  const endPoint = "https://wapp.callindex.co.il/c2c/open_numbers.php";
  try {
    const request = {
      headers: {
        "Access-Control-Allow-Methods": `POST`,
        "Access-Control-Allow-Headers": `Content-Type`,
        "Access-Control-Allow-Origin": `*`,
        "Access-Control-Allow-Credentials": true,
        "ETAG": true
      },
      method: "post",
      url: "/api/activateNumber",
      data: {phoneNumber},
    }

    Response = await axios(request);
    if (Response) {
      console.log("activated number successfuly", phoneNumber);
      return true;
    }
    console.log("failed to activate number", phoneNumber);
    return false;
  } catch (err) {
    console.log("failed to activate number", err);
    return false;
  }
};

export default activatePhoneNumber;

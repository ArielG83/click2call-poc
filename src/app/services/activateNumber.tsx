import axios from "axios";

const endPoint = "https://wapp.callindex.co.il/c2c/open_numbers.php";

const activatePhoneNumber = async (fullPhoneNumber: String) => {
  if (!fullPhoneNumber || fullPhoneNumber.length < 3) {
    console.log("invalid phone number", fullPhoneNumber);
    return false;
  }
  const prefix = fullPhoneNumber?.substring(0, 2);
  const phone_number = fullPhoneNumber?.substring(3);
  try {
    Response = await axios({
      method: "post",
      url: endPoint,
      auth: {
        username: "username", //????????
        password: "password", //????????
      },
      data: {
        uberId: "uberId", //????????
        phone_number,
        prefix,
      },
    });
    if (Response) {
      console.log("activated number successfuly", fullPhoneNumber);
      return true;
    }
    console.log("failed to activate number", fullPhoneNumber);
    return false;
  } catch (err) {
    console.log("failed to activate number", err);
    return false;
  }
};

export default activatePhoneNumber;

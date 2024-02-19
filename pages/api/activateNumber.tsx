import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import axios from "axios";

const cors = Cors({methods: ["POST", "GET", "HEAD", "OPTIONS"]});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function,
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  const { body, method } = req;

  switch (method) {
      case "POST":
        if (!body?.phoneNumber || body.phoneNumber.length < 3) {
          console.log(`invalid phone number: ${body.phoneNumber}`);
          res.status(500).end(`invalid phone number: ${body.phoneNumber}`);
        }
        try {
          const myHeaders = new Headers();
          myHeaders.append("Authorization", "Basic cnV0d0BoYXJlbC1pbnMuY28uaWw6SGFyZWw3OTQ2");
          myHeaders.append("Cookie", "incap_ses_1687_63307=eXp/DmbGHR/BEHo4vG1pF9YO02UAAAAAx1Q1Yezp0AaCdTtqeKRnlQ==; incap_ses_820_63307=MD1TenQJQUVOMVrW2DphCzYS02UAAAAAKP8tJ60EIzYndMQVkY8EWg==; nlbi_63307=kOQZO/5iBWZotSOZuh4RKgAAAADr42NF0EDQExxqYExBIOfL; visid_incap_63307=yLQRyUT/Qh2XYIHvFVyVRPVOw2UAAAAAQUIPAAAAAACY3gJ3veoqr7en2IpKDAzy; PHPSESSID=7603ebc761d6ed4013c6a10330aef5d8");

          const formdata = new FormData();
          formdata.append("uberId", "3613");
          formdata.append("phone_number", "033818324");
          formdata.append("prefix", body.phoneNumber);

          const Response = await fetch("https://wapp.callindex.co.il/c2c/open_numbers.php", {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow"
          })

          if (Response) {
            res.status(200).end(`activated number successfuly: ${body.phoneNumber}, response ${JSON.stringify(Response)}`);
          }
          res.status(500).end(`failed to activate number: ${body.phoneNumber}`);
        } catch (err) {
          res.status(500).end(`failed to activate number: ${body.phoneNumber}, error:${err}`);
        }  
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
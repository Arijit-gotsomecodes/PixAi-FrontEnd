import Replicate from "replicate";
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
  useFileOutput: false, // Disable FileObject and return URL strings
});

export async function POST(request) {

  const data = await request.json();
  // console.log(data)
  try {
      const output = await replicate.run(data?.aiModelName,
          {
              input: {
                  prompt: data?.inputPrompt + " " + data?.defaultPrompt,
                  main_face_image:data?.userImageUrl,
                  image:data?.userImageUrl,
                  num_samples:1
              }
          });
      console.log("Output",output)
      return Response.json({ result: output });
  }
  catch (e) {
      return Response.json({ Error: e });

  }

}

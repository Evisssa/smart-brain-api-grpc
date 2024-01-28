const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
const Clarifai = require('clarifai');
const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();



metadata.set("authorization", "Key c259332a7e5840d69cc75852681017a2");

const PAT = 'c259332a7e5840d69cc75852681017a2';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'clarifai';       
const APP_ID = 'main';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
//const IMAGE_URL = this.state.inputImageForm;



const handleApiCall = (req,res)=>{

  stub.PostModelOutputs(
    {
        // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
        user_app_id: {
          user_id: "clarifai",  // The literal "me" resolves to your user ID.
          app_id: "main"
        },
        model_id:"e466caa0619f444ab97497640cefc4dc",// 'a403429f2ddf4b49b307e318f00e528b',//"aaa03c23b3724a16a56b629203edc62c",
        inputs: [{data: {image: {url: req.body.input }}}] // v
    },
    metadata,
    (err, response) => {
        if (err) {
            console.log("Error: " + err);
            return;
        }

        if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            return;
        }

        console.log("Predicted concepts, with confidence values:")
        for (const c of response.outputs[0].data.concepts) {
            console.log(c.name + ": " + c.value);
        }
        res.json(response)
    }
);


}



const handleImage = (db)=>(req,res)=>{
    const { id } =req.body;

    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
      // entries[0] --> this used to return the entries
      // TO
      // entries[0].entries --> this now returns the entries
     // console.log(entries[0].entries)
      res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json(err))
   
}

module.exports= {
    handleImage : handleImage,
    handleApiCall:handleApiCall
}
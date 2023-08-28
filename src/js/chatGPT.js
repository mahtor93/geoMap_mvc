import { Configuration, OpenAIApi  } from 'openai';


const configuration = new Configuration({
    apiKey:process.env.OPENAI_API_KEY,
    organization:process.env.OPENAI_ORG_KEY,
});

const openai = new OpenAIApi(configuration);

const getChatGPT = async (req,res) =>{
    try{
        return res.status(200).json({
            message:'Funciona',
        })
    }catch(error){
        throw error;
    }
}

const postChatGPT = async (req,res) =>{
    try{
        const response = await openai.createCompletion({
            model: "text-davinci-001",
            prompt:`Dime si conecté bien la API`,
            max_tokens:64,
            temperature:0,
            top_p:1.0,
            frequency_penalty:0.0,
            presence_penalty:0.0,
            stop: ["\n"],
        });

        return res.status(200).json({
            success:true,
            data: response.data.choices[0].text
        });
    }catch(error){
        return res.status(400).json({
            success:false,
            error: error.response ? error.response.data: 'Error de Server'
        })
    }
}



export { getChatGPT, postChatGPT };
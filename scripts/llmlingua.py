from fastapi import FastAPI
from pydantic import BaseModel
from llmlingua import PromptCompressor

app = FastAPI()

# Load LLMLingua-2 model (small model for performance)
compressor = PromptCompressor(
    model_name="microsoft/llmlingua-2-bert-base-multilingual-cased-meetingbank",
    use_llmlingua2=True
)

class PromptRequest(BaseModel):
    prompt: str

@app.post("/compress")
async def compress_prompt(data: PromptRequest):
    compressed = compressor.compress_prompt(data.prompt, rate=0.33)
    return {"compressed_prompt": compressed}

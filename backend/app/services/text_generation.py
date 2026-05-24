from app.services.prompt_refinement import get_groq_client

def generate_marketing_copy(text_prompt: str) -> str:
    """
    Generates marketing copy using the refined text prompt via Groq.
    """
    client = get_groq_client()
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a world-class social media copywriter. Output only the requested marketing copy, with no conversational filler."
                },
                {
                    "role": "user",
                    "content": text_prompt
                }
            ],
            model="llama3-70b-8192",
            temperature=0.8,
            max_tokens=1024,
        )
        
        return chat_completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error in text generation: {e}")
        return "Error generating marketing copy."

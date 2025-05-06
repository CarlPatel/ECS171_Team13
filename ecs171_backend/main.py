from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FormData(BaseModel):
    age: int = Field(gt=0, description="Age must be greater than 0")
    occupation: str

@app.post("/submit")
async def submit_form(data: FormData):
    try:
        income_chance = calculate_income_chance(data.age, data.occupation)
        
        return {
            "message": "Form submitted successfully",
            "data": {
                "age": str(data.age),
                "occupation": data.occupation,
                "income_chance": income_chance
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

def calculate_income_chance(age: int, occupation: str) -> str:
    """Calculate the chance of income being over $50,000 based on age and occupation."""
    if age < 25:
        base_chance = 15
    elif age < 35:
        base_chance = 30
    elif age < 45:
        base_chance = 45
    elif age < 55:
        base_chance = 55
    else:
        base_chance = 40
    
    occupation_lower = occupation.lower()
    if occupation_lower == "engineer":
        base_chance += 30
    elif occupation_lower == "teacher":
        base_chance += 15
    elif occupation_lower == "student":
        base_chance -= 10
    
    return str(base_chance)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
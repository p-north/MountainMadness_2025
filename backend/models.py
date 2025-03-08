from pydantic import BaseModel

# audio model
class Audio(BaseModel):
    id: int | None=None
    audio_url: str
    
    class Config:
        from_attributes = True
class Leaderboard(BaseModel):
    id: int | None = None
    name: str
    score: int
    rank: int | None = None
    
    class Config:
        from_attributes = True
    
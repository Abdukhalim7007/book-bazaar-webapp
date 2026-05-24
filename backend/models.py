from pydantic import BaseModel, Field


class BookResponse(BaseModel):
    """Response model with camelCase for frontend (coverImageUrl)."""

    id: int
    title: str
    author: str
    price: float
    cover_image_url: str = Field(serialization_alias="coverImageUrl")
    description: str = ""

    model_config = {"populate_by_name": True}

from sqlalchemy import Column, Integer, String

from app.database import Base


class Candidate(Base):
    __tablename__ = 'candidates'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    skills = Column(String)
    experience = Column(Integer)

    def __repr__(self):
        return f"<Candidate(id={self.id}, name={self.first_name} {self.last_name})>"

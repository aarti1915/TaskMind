from fastapi import Depends, HTTPException

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from jose import jwt, JWTError

from sqlalchemy.orm import Session


from app.database.connection import get_db

from app.models import User

from app.core.config import settings






security = HTTPBearer()







def get_current_user(

    credentials: HTTPAuthorizationCredentials = Depends(security),

    db: Session = Depends(get_db)

):


    token = credentials.credentials



    try:


        payload = jwt.decode(

            token,

            settings.JWT_SECRET_KEY,

            algorithms=[

                settings.JWT_ALGORITHM

            ]

        )



        user_id = payload.get("user_id")



        if user_id is None:


            raise HTTPException(

                status_code=401,

                detail="Invalid token payload"

            )



    except JWTError:


        raise HTTPException(

            status_code=401,

            detail="Invalid token"

        )





    user = db.query(User).filter(

        User.user_id == user_id

    ).first()





    if user is None:


        raise HTTPException(

            status_code=401,

            detail="User not found"

        )





    return user
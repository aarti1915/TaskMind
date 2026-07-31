from fastapi import Request, HTTPException

from fastapi.responses import JSONResponse

from fastapi.exceptions import RequestValidationError


from app.core.logger import logger

from app.core.response import error_response





async def http_exception_handler(

    request: Request,

    exc: HTTPException

):


    logger.warning(

        f"{exc.status_code}: {exc.detail}"

    )



    return JSONResponse(


        status_code=exc.status_code,


        content=error_response(

            message=str(exc.detail),

            status_code=exc.status_code

        )

    )









async def validation_exception_handler(

    request: Request,

    exc: RequestValidationError

):


    logger.warning(

        "Validation error occurred"

    )



    return JSONResponse(


        status_code=422,


        content={

            "success": False,

            "message": "Validation error",

            "errors": exc.errors(),

            "status_code": 422

        }

    )
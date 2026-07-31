import logging

from logging.handlers import RotatingFileHandler

import os





LOG_DIR = "logs"





if not os.path.exists(LOG_DIR):

    os.makedirs(LOG_DIR)







LOG_FILE = os.path.join(

    LOG_DIR,

    "taskmind.log"

)







logger = logging.getLogger(

    "taskmind"

)





logger.setLevel(

    logging.INFO

)







file_handler = RotatingFileHandler(

    LOG_FILE,

    maxBytes=5_000_000,

    backupCount=5

)







formatter = logging.Formatter(

    "%(asctime)s - %(levelname)s - %(message)s"

)







file_handler.setFormatter(

    formatter

)







logger.addHandler(

    file_handler

)
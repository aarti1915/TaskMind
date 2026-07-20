def format_duration(minutes: int) -> str:
    if minutes < 60:
        return f"{minutes} minutes"

    hours = minutes // 60
    remaining_minutes = minutes % 60

    if remaining_minutes == 0:
        return f"{hours} hour" if hours == 1 else f"{hours} hours"

    if hours == 1:
        return f"1 hour {remaining_minutes} minutes"

    return f"{hours} hours {remaining_minutes} minutes"

from app.utils.time_format import format_duration


@api_router.get("/missing-eod")
async def get_missing_eod(current_user: User = Depends(get_current_user)):
    if not current_user.joining_date:
        return {
            "ecmp": [],
            "uc": [],
            "total_missing": 0,
            "message": "Joining date not set"
        }

    try:
        start_date = datetime.strptime(current_user.joining_date, "%d/%m/%Y")
    except ValueError:
        try:
            start_date = datetime.strptime(current_user.joining_date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid joining date format")

    reports = await db.reports.find(
        {"user_id": current_user.id},
        {"_id": 0, "report_date": 1, "report_type": 1}
    ).to_list(1000)

    ecmp_dates = {
        report["report_date"]
        for report in reports
        if report.get("report_type") == "ECMP"
    }

    uc_dates = {
        report["report_date"]
        for report in reports
        if report.get("report_type") == "UC"
    }

    missing_ecmp = []
    missing_uc = []

    today = datetime.now(timezone.utc).replace(tzinfo=None)
    check_date = start_date

    while check_date <= today:
        date_str = check_date.strftime("%d/%m/%Y")

        # Sunday ignore
        if check_date.weekday() != 6:
            if date_str not in ecmp_dates:
                missing_ecmp.append({
                    "date": date_str,
                    "type": "ECMP",
                    "status": "NOT-Uploaded"
                })

            if date_str not in uc_dates:
                missing_uc.append({
                    "date": date_str,
                    "type": "UC",
                    "status": "NOT-Uploaded"
                })

        check_date = check_date + timedelta(days=1)

    return {
        "ecmp": missing_ecmp,
        "uc": missing_uc,
        "total_missing": len(missing_ecmp) + len(missing_uc)
    }

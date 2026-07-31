import api from "./axios";


// Dashboard summary

export const getDashboardSummary = ()=>{

    return api.get(
        "/dashboard/summary"
    );

};




// Daily study analytics

export const getDailyAnalytics = ()=>{

    return api.get(
        "/analytics/daily"
    );

};




// Subject progress

export const getSubjectProgress = ()=>{

    return api.get(
        "/progress/subjects"
    );

};




// Topic progress

export const getTopicProgress = ()=>{

    return api.get(
        "/progress/topics"
    );

};




// Sub topic progress

export const getSubTopicProgress = ()=>{

    return api.get(
        "/progress/sub-topics"
    );

};




// Study streak

export const getStudyStreak = ()=>{

    return api.get(
        "/analytics/streak"
    );

};




// Weekly analytics

export const getWeeklyAnalytics = ()=>{

    return api.get(
        "/analytics/weekly"
    );

};




// Monthly analytics

export const getMonthlyAnalytics = ()=>{

    return api.get(
        "/analytics/monthly"
    );

};
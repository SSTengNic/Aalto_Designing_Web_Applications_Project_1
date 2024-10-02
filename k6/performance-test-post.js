import http from "k6/http";

export const options = {
    duration: "5s",
    vus: 10,
    summaryTrendStats: ["avg", "p(99)", "med"],
};

export default function () {
    http.post(
        "http://localhost:7800/api/prac",
        JSON.stringify({
            programming_assignment_id: 1,
            code: 'def hello(): return "Hello"',
            user_uuid: "7f066e1f-9433-47b3-bd1e-cb45cc4279b8",
        })
    );
}

// MY MODULE
exports.getDate = function(){
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    let day = today.toLocaleDateString("en-US", options); 
    return day;
};

exports.getHour = function(){
    let today = new Date();
    let options = {
        weekday: "long"
    };
    let day = today.toLocaleTimeString("en-US", options);
    return day;
}
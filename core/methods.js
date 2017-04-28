Quintus.GameMethods = function(Q)
{

    Q.bgcolor = function(color)
    {
        var body = document.querySelector("body");
        body.style.backgroundColor = Q.COLORS[color]["hex"];
    }

    Q.score2color = function(score)
    {
        if(score < Q.COLORS["green"]["score"])
            return "blue";
        else if(score >= Q.COLORS["green"]["score"] && score < Q.COLORS["yellow"]["score"])
            return "green";
        else if(score >= Q.COLORS["yellow"]["score"] && score < Q.COLORS["orange"]["score"])
            return "yellow";
        else if(score >= Q.COLORS["orange"]["score"] && score < Q.COLORS["red"]["score"])
            return "orange";
        else
            return "red";
    }

    Q.random = function(min, max)
    {
        return min + Math.random() * (max - min);
    }

};
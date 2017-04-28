Quintus.GameMethods = function(Q)
{

    Q.bgcolor = function(color)
    {
        var body = document.querySelector("body");
        body.style.backgroundColor = Q.COLORS[color]["hex"];
    }

    Q.score2color = function(score)
    {
        var array = Object.keys(Q.COLORS).map(function (key)
        {
            return Q.COLORS[key]["score"]; 
        });

        var closest = Math.min.apply(null, array);

        for(var i = 0; i < array.length; i++)
        {
            if(array[i] <= score && array[i] > closest)
                closest = array[i];
        }

        return Object.keys(Q.COLORS).find(key => Q.COLORS[key]["score"] === closest);
    }

    Q.random = function(min, max)
    {
        return min + Math.random() * (max - min);
    }

};
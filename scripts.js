var gridOptions = {
    color: 'grey',
    GridSize: 40,
    LinesSize: 1
};

var i, Height, Width, GridSize, ctx, canvas;
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
var Height = canvas.height;
var Width = canvas.width;

function getRandomCol() {
    return Math.floor(Math.random() * ( Width / gridOptions.GridSize ))
}

function getRandomRow() {
    return Math.floor(Math.random() * ( Height / gridOptions.GridSize ))
}

function getX(c) {
    return c % Math.floor(( Width / gridOptions.GridSize )) * gridOptions.GridSize
}

function getY(r) {
    return r % Math.floor(( Width / gridOptions.GridSize )) * gridOptions.GridSize
}

let personPos = {
    'c': 0,
    'r': 0, 
}

filledTiles = [
    {
        pos: `${personPos.c},${personPos.r}`,
        type: 'person'
    }
]

let targetPos = {}

while (undefined == targetPos.x) {
    let c = getRandomCol()
    let r = getRandomRow()

    if ( filledTiles.filter( el => el.pos === `${c},${r}`).length === 0 ){
        targetPos.c = c
        targetPos.r = r
    }

    break
}

function displayGrid() {
    ctx.strokeStyle = gridOptions.color;
    ctx.lineWidth = parseInt(gridOptions.LinesSize);
    GridSize = 0;
    GridSize = parseInt(gridOptions.GridSize);
    for (i = 0; i < Height; i += GridSize) {
        ctx.moveTo(0, i);
        ctx.lineTo(Width, i);
        ctx.stroke();
    }
    for (i = 0; i < Width; i += GridSize) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, Height);
        ctx.stroke();
    }
}

function drawPerson(c, r) {
    ctx.drawImage(
        document.getElementById('person'), 
        getX(c),
        getY(r),
        40, 
        40
    )
}

function drawTrees() {
    for(let i = 0; i < 100; i ++){
        c = getRandomCol()
        r = getRandomRow()

        if ( filledTiles.filter( el => el.pos === `${c},${r}`).length > 0 ){
            i -= 1
            continue
        }

        ctx.drawImage(
            document.getElementById('tree'), 
            getX(c) + 1,
            getY(r) + 1,
            38, 
            38
        )

        filledTiles.push(
            {
                pos: `${c},${r}`,
                type: 'tree'
            }
        )
    }
}

function drawTarget() {
    ctx.drawImage(
        document.getElementById('house'), 
        getX(targetPos.c),
        getY(targetPos.r),
        40, 
        40
    )

    filledTiles.push(
        {
            pos: `${targetPos.c},${targetPos.r}`,
            type: 'target'
        }
    )
}

document.addEventListener('DOMContentLoaded', () => {
    displayGrid()
    drawPerson(personPos.c, personPos.r)
    drawTarget()
    drawTrees()

    c = {
        c: personPos.c,
        r: personPos.r
    }

    q = [c]
    found = false
    visited = []
    paths = {}
    paths[`${c.c},${c.r}`] = false
    found = false

    while (q.length > 0) {
        old = c
        c = q.shift()
        dr = [-1, 1, 0, 0]
        dc = [0, 0, -1, 1]

        if(targetPos.c == c.c && targetPos.r == c.r){
            found = true
            break
        }

        for(let i = 0; i < dr.length; i++) {
            cr = c.r + dr[i]
            cc = c.c + dc[i]
            
            if ( cr < 0 || cc < 0 || cr > Math.floor(Height / gridOptions.GridSize) - 1 || cc > Math.floor(Width / gridOptions.GridSize) - 1) {
                continue
            }

            if ( visited.indexOf( `${cc},${cr}` ) !== -1 ) {
                continue
            }

            let notEmptyArea = filledTiles.filter( el => el.pos == `${cc},${cr}` )

            if ( notEmptyArea.length > 0 && notEmptyArea[0].type == 'tree' ) {
                continue
            }

            visited.push(`${cc},${cr}`)
            q.push({c: cc, r: cr})
            paths[`${cc},${cr}`] = `${c.c},${c.r}`
        }
    }

    if(found) {
        run()
    } else {
        alert('No path found :(')
    }

    console.log(paths)
    console.log(targetPos)
    console.log(personPos)
})


rightPath = {}
function run() {
    rightPath = [`${targetPos.c},${targetPos.r}`]

    c = paths[`${targetPos.c},${targetPos.r}`]
    
    while(c !== `${personPos.c},${personPos.r}`) {
        rightPath.push(c)
        c = paths[c]
    }    


    rightPath = rightPath.reverse()
    old = {c: personPos.c, r: personPos.r}
    window.requestAnimationFrame(animatePath);
}

function animatePath(){
    curr = rightPath.shift();
    ctx.clearRect(getX(old.c) + 1, getY(old.r) + 1, 38, 38)
    res = curr.split(',')
    old = {c: res[0], r: res[1]}
    drawPerson(res[0], res[1])

    if(rightPath.length > 0) {
        setTimeout(() => {
            window.requestAnimationFrame(animatePath);
        }, 100)
    }
}
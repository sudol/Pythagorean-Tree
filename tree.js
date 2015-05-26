
window.onload = function() {
    canvas = document.getElementById("main");
    ctx = canvas.getContext("2d");

    /*
     * Scaling canvas taken from Paul Lewis
     * http://www.html5rocks.com/en/tutorials/canvas/hidpi/
     */
    var devicePixelRatio = window.devicePixelRatio || 1,
        backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                            ctx.mozBackingStorePixelRatio ||
                            ctx.msBackingStorePixelRatio ||
                            ctx.oBackingStorePixelRatio ||
                            ctx.backingStorePixelRatio || 1,

        ratio = devicePixelRatio / backingStoreRatio;

    // ensure we have a value set for auto.
    // If auto is set to false then we
    // will simply not upscale the canvas
    // and the default behaviour will be maintained
    if (typeof auto === 'undefined') {
        auto = true;
    }

    // upscale the canvas if the two ratios don't match
    if (auto && devicePixelRatio !== backingStoreRatio) {

        var oldWidth = canvas.width;
        var oldHeight = canvas.height;

        canvas.width = oldWidth * ratio;
        canvas.height = oldHeight * ratio;

        canvas.style.width = oldWidth + 'px';
        canvas.style.height = oldHeight + 'px';

        // now scale the ctx to counter
        // the fact that we've manually scaled
        // our canvas element
        ctx.scale(ratio, ratio);
    }

    var trunk = new branch();

    trunk.level = 1;
    trunk.length = 200;
    trunk.angle = 90;
    trunk.parent = {x:canvas.width/ratio/2, y:canvas.height/ratio};
    trunk.x = canvas.width/ratio/2;
    trunk.y = trunk.parent.y - trunk.length;

    trunk.iterate(15);
}

function branch(parent) {
    this.length = null;
    this.angle = null;
    this.x = null;
    this.y = null;
    this.parent = parent;
    this.children = [];

    this.iterate = function (level) {
        if (this.level >= level)
            return;

        this.draw();

        var childBranch = new branch(this);

        childBranch.angle = this.angle - 65;
        childBranch.level = this.level + 1;
        childBranch.length = ((this.length/Math.sin(90 * (Math.PI/180))) * Math.sin(45 * (Math.PI/180)));
        childBranch.x = this.x - (Math.cos(childBranch.angle * (Math.PI/180)) * childBranch.length);
        childBranch.y = this.y - (Math.sin(childBranch.angle * (Math.PI/180)) * childBranch.length);

        this.children.push(childBranch);
        childBranch.iterate(level);

        var childBranch = new branch(this);

        childBranch.angle = this.angle + 25;
        childBranch.level = this.level + 1;
        childBranch.length = ((this.length/Math.sin(90 * (Math.PI/180))) * Math.sin(45 * (Math.PI/180)));
        childBranch.x = this.x - (Math.cos(childBranch.angle * (Math.PI/180)) * childBranch.length);
        childBranch.y = this.y - (Math.sin(childBranch.angle * (Math.PI/180)) * childBranch.length);

        this.children.push(childBranch);
        childBranch.iterate(level);
    }

    this.draw = function () {

        ctx.beginPath();
        ctx.moveTo(this.parent.x, this.parent.y);
        ctx.lineTo(this.x, this.y)
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(255,255,255," + 1/this.level + ")";
        ctx.stroke();
    }
};

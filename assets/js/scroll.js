(function () {
    var supportsTouch = false;

    if ('ontouchstart' in window){
        supportsTouch = true;
        } else if(window.navigator.msPointerEnabled) {
        supportsTouch = true;
        } else if ('ontouchstart' in document.documentElement) {
        supportsTouch = true;
    }

    var el = document.getElementById('itemsContainer')

    // SETTINGS FOR CAROUSEL EVENTS
    var isMouseDown = false
    
    // Setting isMouseDown to true once the user clicks
    // on the el container
    el.addEventListener('mousedown', function(e) {
        x = e.offsetX;
        y = e.offsetY;

        console.log(x, y)

        isMouseDown = true
    })

    el.addEventListener('mousemove', function(e) {
        if(isMouseDown) {
            console.log('Am clicked and dragging')
        }
    })

    el.addEventListener('mouseup', function(e) {
        if(isMouseDown) {
            isMouseDown = false
            console.log('Am setting it to false')
        }
    })
})();
(function () {
    var el = document.getElementById('itemsContainer')
    var innerDoc = document.getElementsByClassName('k-scroll-inner-container')

    // SETTINGS FOR CAROUSEL EVENTS
    var isMouseDown = false
    var containerLeftPos = 0
    var mouseDistance = 0

    // Getting the mouse position
    function getMousePosition(e, $this) {
        var m_posx = 0, m_posy = 0, e_posx = 0, e_posy = 0, obj = $this;

        //get mouse position on document crossbrowser
        // 'mouseposition' - 'parent element position' = 'mouseposition relative to parent element'
        // https://www.quirksmode.org/js/events_properties.html#position
        // https://www.quirksmode.org/js/findpos.html
        if (!e){e = window.event;}

        if (e.pageX || e.pageY){
            m_posx = e.pageX;
            m_posy = e.pageY;
        } else if (e.clientX || e.clientY){
            m_posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            m_posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        
        //get parent element position in document
        if (obj.offsetParent){
            do { 
                e_posx += obj.offsetLeft;
                e_posy += obj.offsetTop;
            } while (obj = obj.offsetParent);
        }

        return {
            x: m_posx - e_posx,
            y: m_posy - e_posy,
            offLef: e_posx
        }
    }

    // Getting the touch position
    function getTouchPosition(e, $this) {
        return {
            x: e.touches[0].clientX
        }
    }

    var scrollPos = {
        mousedown: {
            x: 0,
            y: 0,
            offLef: 0
        },
        mousemove: {
            x: 0,
            y: 0
        }
    }

    function resetScrollPos() {
        scrollPos = {
            mousedown: {
                x: 0,
                y: 0,
                offLef: 0,
                clientX: 0
            },
            mousemove: {
                x: 0,
                y: 0
            }
        }
    }

    function calculateScrollPos() {
        var pos = 0
        var symbol = ''
        var oldMouseDistance = mouseDistance
        mouseDistance = 0

        if(scrollPos.mousedown.clientX > scrollPos.mousemove.x) {
            mouseDistance = scrollPos.mousedown.clientX - scrollPos.mousemove.x
            symbol = '-'
            mouseDistance = -mouseDistance
        } else {
            mouseDistance = scrollPos.mousemove.x - scrollPos.mousedown.clientX
            symbol = '+'
            mouseDistance = +mouseDistance
        }

        var dvStyle = innerDoc[0].getAttribute('style');
        if(dvStyle) {
            var transZRegex = /\.*translateX\((.*)px\)/i;            
            var zTrans = transZRegex.exec(dvStyle)[1];
            containerLeftPos = parseInt(zTrans)
        }
    }

    // working with button controls
    var moveLeft = document.getElementById('moveLeft')
    var reset = document.getElementById('reset')
    var moveRight = document.getElementById('moveRight')
    
    // Getting the default values of containers
    var itemContainerWidth = el.offsetWidth
    var innerItemContainerWidth = innerDoc[0].offsetWidth
    var position = 0
    var startX = 0
    var endX = 0

    var showLeftArrow = function() {
        if(position <= (0 - 8)) {
            moveRight.style.visibility = 'visible'
        } else {
            moveRight.style.visibility = 'hidden'
        }
    }

    var showRightArrow = function() {
        if( (-(position) + itemContainerWidth) < innerItemContainerWidth  + 8) {
            moveLeft.style.visibility = 'visible'
        } else {
            moveLeft.style.visibility = 'hidden'
        }
    }

    var checkAndShowNavs = function() {
        showLeftArrow();
        showRightArrow()
    }

    var checkAndMoveCarousel = function(pos , distance) {
        // console.log(pos, distance)
        if(pos === 'left') {
            if( (-(position) + itemContainerWidth) < innerItemContainerWidth  + 8) {
                position = position + (-distance)
                // check if the inner container end value less than 
                // the positon derived then need to fix the point to 
                // container end and also position

                var removeNg = -(position)
                if(removeNg <= ((innerItemContainerWidth + 8) - itemContainerWidth)) {
                    innerDoc[0].style.transform = 'translateX('+position+'px)';                
                } else {
                    innerDoc[0].style.transform = 'translateX(-'+(((innerItemContainerWidth + 8) - itemContainerWidth))+'px)';
                }
            }
        } else if(pos === 'right') {
            if(position < 0) {
                position += distance
                // check if the inner container start value less than 
                // 0 if derived position execeeds then fix to 0
                
                if(position <= 0) {
                    innerDoc[0].style.transform = 'translateX('+position+'px)';
                } else {
                    position = 0 
                    innerDoc[0].style.transform = 'translateX('+position+'px)';
                }
            }
        } else if(pos === 'reset') {
            position = 0 
            innerDoc[0].style.transform = 'translateX('+position+'px)';            
        }
        checkAndShowNavs(position)
    }

    // Writing clickable function to control over the carousel
    moveLeft.addEventListener('click', function(e) {
        checkAndMoveCarousel('left', 1)
    })

    moveRight.addEventListener('click', function(e) {   
        checkAndMoveCarousel('right', 1)
    })

    reset.addEventListener('click', function(e) {
        checkAndMoveCarousel('reset')
    })

    // Setting isMouseDown to true once the user clicks
    // on the el container
    el.addEventListener('mousedown', function(e) {
        var data = getMousePosition(e, this)
        startX = data.x
        isMouseDown = true
    })

    var distanceMove = 0
    window.addEventListener('mousemove', function(e) {
        if(isMouseDown) {
            innerDoc[0].classList.add("no-select");
            var data = getMousePosition(e, this)
            endX = data.x

            var positionType = ''
            if(startX > endX) {
                positionType = 'left'
                var oldDistanceMove = distanceMove
                distanceMove = startX - endX
                // console.log(oldDistanceMove, distanceMove)
                if(oldDistanceMove != distanceMove) {
                    // console.log(oldDistanceMove, distanceMove)
                    checkAndMoveCarousel(positionType, distanceMove)
                }
            } else if(startX < endX) {
                positionType = 'right'
                distanceMove = endX - startX                
                if(oldDistanceMove != distanceMove) {
                    // console.log(oldDistanceMove, distanceMove)
                    checkAndMoveCarousel(positionType, distanceMove)
                }
            }

            startX = data.x
        }
    })

    window.addEventListener('mouseup', function(e) {
        if(isMouseDown) {
            isMouseDown = false
            innerDoc[0].classList.remove("no-select");
        }
    })

    // Touch Events
    el.addEventListener("touchstart", function(e){
        var data = getTouchPosition(e, this)
        startX = data.x
        isMouseDown = true
    });

    window.addEventListener("touchmove", function(e) {
        if(isMouseDown) {
            innerDoc[0].classList.add("no-select");
            var data = getTouchPosition(e, this)
            endX = data.x

            var positionType = ''
            if(startX > endX) {
                positionType = 'left'
                var oldDistanceMove = distanceMove
                distanceMove = startX - endX
                
                if(oldDistanceMove != distanceMove) {
                    checkAndMoveCarousel(positionType, distanceMove)
                }
                
            } else if(startX < endX) {
                positionType = 'right'
                distanceMove = endX - startX                
                if(oldDistanceMove != distanceMove) {
                    checkAndMoveCarousel(positionType, distanceMove)
                }
            }

            startX = data.x
        }
    });

    window.addEventListener("touchend", function(e) {
        if(isMouseDown) {
            isMouseDown = false
            innerDoc[0].classList.remove("no-select");
        }
    });

    // Add click event listener for each item
    // This will be based on config in near future
    document.querySelectorAll('.k-scroll-item').forEach(item => {
        item.addEventListener('click', event => {
            event.stopPropagation()
            // console.log('I am clicked!')
        })
    })

    checkAndShowNavs()
})();
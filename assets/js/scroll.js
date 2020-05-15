(function () {
    var el = document.getElementById('itemsContainer')
    var innerDoc = document.getElementsByClassName('k-scroll-inner-container')

    // SETTINGS FOR CAROUSEL EVENTS
    var isMouseDown = false
    var containerLeftPos = 0

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
        // Logic work has to made
        var dis = 0
        var symbol = ''
        if(scrollPos.mousedown.clientX > scrollPos.mousemove.x) {
            dis = scrollPos.mousedown.clientX - scrollPos.mousemove.x
            symbol = '-'
            console.log('mousedown position is greater', scrollPos.mousedown.clientX - scrollPos.mousemove.x )
        } else {
            dis = scrollPos.mousemove.x - scrollPos.mousedown.clientX
            symbol = '+'
            console.log('mousedown position is lesser', scrollPos.mousemove.x - scrollPos.mousedown.clientX)
        }

        innerDoc[0].style.transform = 'translateX('+symbol+''+dis+'px)';
    }
    
    // Setting isMouseDown to true once the user clicks
    // on the el container
    el.addEventListener('mousedown', function(e) {
        var data = getMousePosition(e, this)
        scrollPos.mousedown.x = data.x
        scrollPos.mousedown.y = data.y
        scrollPos.mousedown.offLef = data.offLef
        scrollPos.mousedown.clientX = data.x + data.offLef
        isMouseDown = true
    })

    window.addEventListener('mousemove', function(e) {
        if(isMouseDown) {
            innerDoc[0].classList.add("no-select");
            var data = getMousePosition(e, this)
            scrollPos.mousemove.x = data.x
            scrollPos.mousemove.y = data.y
            calculateScrollPos()
        }
    })

    window.addEventListener('mouseup', function(e) {
        if(isMouseDown) {
            isMouseDown = false
            innerDoc[0].classList.remove("no-select");
            console.log('Am setting it to false')
            resetScrollPos()
        }
    })

    document.querySelectorAll('.k-scroll-item').forEach(item => {
        item.addEventListener('click', event => {
            event.stopPropagation()
            console.log('I am clicked!')
        })
    })
})();
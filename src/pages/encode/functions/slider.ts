function ionViewDidEnter() {
    this.SwipedTabsIndicator = document.getElementById("indicator");
}

function selectTab(index) {
    this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(100*index)+'%,0,0)';
    this.SwipedTabsSlider.slideTo(index, 500);
}

function updateIndicatorPosition() {
    // this condition is to avoid passing to incorrect index
    if( this.SwipedTabsSlider.length()> this.SwipedTabsSlider.getActiveIndex())
    {
        this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(this.SwipedTabsSlider.getActiveIndex() * 100)+'%,0,0)';
    }
}

function animateIndicator($event) {
    if(this.SwipedTabsIndicator)
        this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (($event.progress* (this.SwipedTabsSlider.length()-1))*100) + '%,0,0)';
}

export {
    // ionViewDidEnter,
    // selectTab,
    // updateIndicatorPosition,
    // animateIndicator
};
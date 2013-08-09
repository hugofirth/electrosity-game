/**
 * Created with IntelliJ IDEA.
 * User: hugofirth
 * Date: 27/04/2013
 * Time: 14:33
 * To change this template use File | Settings | File Templates.
 */
Crafty.c('Blink',
    {
        _fadeIn: true,
        _blinkActive: false,
        _blinkFrames: 100,

        init: function()
        {
            this.requires('Tween');
            this.startBlinking();

        },

        _blink: function()
        {
            if(this._fadeIn && !this._blinkActive) {
                this._blinkActive = true;
                this.tween({alpha: 0.0}, this._blinkFrames);
            } else if(!this._blinkActive) {
                this._blinkActive = true;
                this.tween({alpha: 1.0}, this._blinkFrames);
            }

            if(Crafty.frame() % this._blinkFrames === 0) {
                this._fadeIn = !this._fadeIn;
                this._blinkActive = false;
            }
        },

        stopBlinking: function()
        {
            this.unbind('EnterFrame', this._blink);
            this._blinkActive = false;
            this._fadeIn = true;
        },

        startBlinking: function()
        {
            this.bind('EnterFrame', this._blink);
        },

        setBlinkFrames: function(frames)
        {
            this._blinkFrames = frames;
        }
    }
);
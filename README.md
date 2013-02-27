jQuery Translate
================

A simple lightweight jQuery plugin that wraps Google Translate API 2.0


### Configuration

The plugin has configurable namespace that you can set in your app so you dont have to worry about supplying them.

The example below sets the Google Translate API key and assumes the source will always be English.

```js
$.translate = {
    key : 'Enter google translate API key here',
    source : 'en'
};
```

### Translating

Translating is simple, just use a selector to find your element and call translate with any options that have not been defined above.

```html
<div class="translate-me">
    Hello world.
</div>
```

```js
$(function () {
    $('.translate-button').on('click', function() {
        $('.translate-me').translate({ target : 'fr' });
    });
});
```

A subsiquent call to translate will remember the last options that were used. Fore example a target is not needed when translating the 'b' element.

```js
$('.a').translate({ target : 'fr' });
$('.b').translate();
```

### Translation indicator

A translation indicator is insrerted before the element to be translated. By default it is this:

```html
<div class="translating">Translating</div>
```

This can be overridden in the global configuration or paramater options by setting progressIndicator.

```js
$('.a').translate({
	source : 'de',
	target : 'fr',
	progressIndicator : '<span class="my-indicator"></span>'
});
```
or
```js
$.translate.progressIndicator = '<span class="my-indicator"></span>';
```

### On complete callback

Finally, when the translaton is complete an onComplete callback is fired that can be set as an option or in the global configuration.

```js
$('.a').translate({
	onComplete : function() { alert('Done!'); }
});
```
or
```js
$.translate.onComplete = function() {
	alert('Done!');
}
```

### Licence

[MIT Licence](https://github.com/michaeldewildt/jquery-translate/blob/master/LICENCE)
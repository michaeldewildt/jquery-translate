;(function ($, window, undefined) {
    'use strict';

    $.translate = {};

    var properties = {
        MAX_SIZE : 1000,
        progressIndicator : $('<div class="translating">Translating</div>')
    };

    var methods = {
        push : function(text) {
            properties.textSize += text.length;
            if (properties.textSize > properties.MAX_SIZE) {
                properties.textCollectionIndex++;
                properties.textCollection[properties.textCollectionIndex] = [];
                properties.textSize = text.length;
            }

            properties.textCollection[properties.textCollectionIndex].push(encodeURIComponent(text));
        },
        collect : function($element) {
            var $children = $element.children();

            if ($children.size() > 0) {
                $children.each(function() {
                    methods.push($(this).text().trim());
                });
            } else if ($element.size() > 0) {
                $element.each(function() {
                    methods.push($(this).text().trim());
                });
            } else {
                methods.push($element.text().trim());
            }
            return this;
        },
        done : function($element) {
            var
                $children = $element.children(),
                text = []
                ;

            for (var i = 0; i <= properties.translatedTextCollection.length; i++) {
                text = text.concat(properties.translatedTextCollection[i]);
            }

            if ($children.size() > 0) {
                $children.each(function(i) {
                    $(this).html(text[i]);
                });
            } else if ($element.size() > 0) {
                $element.each(function(i) {
                    $(this).html(text[i]);
                });
            } else {
                $element.html(text[0]);
            }

            return this
                .removeProgress($element)
                .onComplete()
                ;
        },
        parseResonse: function(index, response) {
            var translations = response.data.translations;

            properties.translatedTextCollection[index] = [];
            for (var i = 0; i < translations.length; i++) {
                properties.translatedTextCollection[index].push(translations[i].translatedText);
            }

            return this;
        },
        showProgress : function($element) {
            properties.progressIndicator.insertBefore($element);

            return this;
        },
        removeProgress : function($element) {
            $element.prev().remove();

            return this;
        },
        setDefaults : function() {
            if (typeof $.translate.progressIndicator !== 'undefined') {
                if (typeof $.translate.progressIndicator === 'object') {
                    properties.progressIndicator = $.translate.progressIndicator;
                } else {
                    properties.progressIndicator = $($.translate.progressIndicator);
                }
                delete $.translate.progressIndicator;
            }

            if (typeof $.translate.onComplete !== 'undefined') {
                methods.onComplete = $.translate.onComplete;
                delete $.translate.onComplete;
            }

            properties.translatedTextCollection = [];
            properties.textCollection = [[]];
            properties.textCollectionIndex = 0;
            properties.textSize = 0;

            return this;
        },
        onComplete : function() {}
    };

    $.fn.translate = function(options) {
        if (!this.length) {
            $.error("Element not found: '" + this.selector + "'");
        }

        $.translate = $.extend(options, $.translate);

        methods
            .setDefaults()
            .collect(this)
            .showProgress(this)
            ;

        var
            $this = this,
            requestPromises = [],
            ajaxRequest = (function() {
                var count = 0;
                return function() {
                    var index = count++;
                    return $.get(
                        'https://www.googleapis.com/language/translate/v2?q=' + properties.textCollection[index].join('&q='),
                        $.translate
                    ).done(function(res) {
                        methods.parseResonse(index, res);
                    }).fail(function(res) {
                        methods.removeProgress($this);
                        $.error(res.responseText);
                    });
                };
            })();

        for (var i in properties.textCollection) {
            requestPromises.push(ajaxRequest());
        }

        return $.when.apply($, requestPromises).then(function () {
            methods.done($this);
        });
    };

}(jQuery, window));
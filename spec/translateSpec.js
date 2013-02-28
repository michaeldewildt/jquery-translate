describe("translating", function() {

    beforeEach(function() {
        jasmine.Ajax.useMock();

        clearAjaxRequests();

        $.translate.key = 'myApiKey';
    });

    describe("a single element with text in it", function() {

        it("should post a valid request", function() {
            var
                html = $('<div><div class="a"><p>Awesome!</p></div></div>'),
                element = html.find('.a')
                ;

            element.translate({
                source: 'en',
                target: 'de'
            });

            expect(element.prev().text()).toEqual('Translating');

            request = mostRecentAjaxRequest();
            expect(request.url).toBe('https://www.googleapis.com/language/translate/v2?q=Awesome!&source=en&target=de&key=myApiKey');
            expect(request.method).toBe('GET');
        });

        it("should encode request params correctly", function() {
            var
                html = $('<div><div class="a"><p>/ ? : @ & = + $ #</p></div></div>'),
                element = html.find('.a')
                ;

            element.translate({
                source: 'en',
                target: 'de'
            });

            expect(element.prev().text()).toEqual('Translating');

            request = mostRecentAjaxRequest();
            expect(request.url).toBe('https://www.googleapis.com/language/translate/v2?q=%2F%20%3F%20%3A%20%40%20%26%20%3D%20%2B%20%24%20%23&source=en&target=de&key=myApiKey');
            expect(request.method).toBe('GET');
        });

    });

    describe("miltiple elements with text in them", function() {

        it("should post a valid request", function() {
            var
                html = $('<div><div class="a"><p>One</p><p>Two</p></div><div>'),
                element = html.find('.a')
                ;

            element.translate({
                source: 'en',
                target: 'de'
            });

            expect(element.prev().text()).toEqual('Translating');

            request = mostRecentAjaxRequest();
            expect(request.url).toBe('https://www.googleapis.com/language/translate/v2?q=One&q=Two&source=en&target=de&key=myApiKey');
            expect(request.method).toBe('GET');
        });

        it("should encode request params correctly", function() {
            var
                html = $('<div><div class="a"><p>/ ? : @ &</p><p>= + $ #<p></div></div>');
                element = html.find('.a')
                ;

            element.translate({
                source: 'en',
                target: 'de'
            });

            expect(element.prev().text()).toEqual('Translating');

            request = mostRecentAjaxRequest();
            expect(request.url).toBe('https://www.googleapis.com/language/translate/v2?q=%2F%20%3F%20%3A%20%40%20%26&q=%3D%20%2B%20%24%20%23&q=&source=en&target=de&key=myApiKey');
            expect(request.method).toBe('GET');
        });

        it("it should split exceed 2000 chars in the request url", function() {
            var
                html = $('<div>' +
                    '<p class="long">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut nec pulvinar massa. Integer pulvinar dapibus lorem, nec tempus sapien gravida quis. Praesent eget nisi nisl. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus vestibulum dolor non quam vehicula suscipit. Donec a metus nibh, non sollicitudin augue. Sed dapibus adipiscing dignissim. Quisque tellus leo, commodo nec porta ac, posuere sit amet sapien.</p>' +
                    '<p class="long">Quisque in venenatis sem. Suspendisse potenti. Donec nibh ipsum, pharetra ac tincidunt ut, aliquet vel tellus. Morbi vehicula pharetra urna, eu malesuada lacus viverra eget. Praesent bibendum augue non arcu pulvinar vel adipiscing urna tempus. Phasellus in ante nulla. Aliquam id pellentesque purus. Praesent porttitor lectus quam. Vivamus feugiat pharetra dictum. Phasellus ac leo nulla. Integer tincidunt luctus risus, eu sagittis erat aliquet eget.</p>' +
                    '<p class="long">Cras fringilla, elit id malesuada porttitor, enim est laoreet nibh, et varius odio sem vitae diam. Phasellus id magna vitae erat pretium aliquet. Vestibulum eu odio ut metus volutpat tempus. Suspendisse potenti. Mauris accumsan mollis elit. Sed metus ipsum, mattis vel fermentum ut, pretium in nunc. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam interdum rutrum tellus, ut mollis sapien hendrerit id. Aliquam eget leo quam. Aenean sem eros, mollis at vulputate non, facilisis et justo. Donec ut arcu velit. Sed quis dui metus. Ut eget sem ligula, sit amet egestas nisl.</p>' +
                    '<p class="long">Aliquam sollicitudin congue neque, a condimentum libero cursus at. Nunc ut odio nec dolor bibendum bibendum. Sed consequat, quam eu condimentum rutrum, ante augue blandit erat, sit amet lacinia sapien lorem vel libero. Donec feugiat, risus eget sollicitudin congue, ante nunc elementum massa, ac consectetur erat dui quis dolor. Praesent lacinia, leo non sagittis rutrum, leo orci condimentum sapien, id interdum tellus libero vel diam. Phasellus cursus semper libero amet.</p>' +
                    '<p class="long">Aliquam sollicitudin congue neque, a condimentum libero cursus at. Nunc ut odio nec dolor bibendum bibendum. Sed consequat, quam eu condimentum rutrum, ante augue blandit erat, sit amet lacinia sapien lorem vel libero. Donec feugiat, risus eget sollicitudin congue, ante nunc elementum massa, ac consectetur erat dui quis dolor. Praesent lacinia, leo non sagittis rutrum, leo orci condimentum sapien, id interdum tellus libero vel diam. Phasellus cursus semper libero amet.</p>' +
                '</div>');
                element = html.find('.long')
                ;

            element.translate({
                source: 'en',
                target: 'de'
            });

            for (var i = 0; i < ajaxRequests.length; i++) {
                expect(ajaxRequests[i].url.length).toBeLessThan(2000);
            }
        });

    });

    describe("on success", function() {

        it("it should update the div with translated text", function() {
            var
                html = $('<div><div class="a">Hello</div> <div class="a">World!</div></div>');
                element = html.find('.a')
                ;

            element.translate({
                source: 'en',
                target: 'de'
            });

            expect(html.find('.translating').size()).toEqual(2);

            mostRecentAjaxRequest().response({
                status: 200,
                responseText: '{"data": {"translations": [{"translatedText": "Hallo"},{"translatedText": "Welt!"}]}}'
            });

            expect(html.find('.translating').size()).toEqual(0);
            expect(html.text()).toBe('Hallo Welt!');
        });

        it("it should show and remove a custom progress indicator jquery object", function() {
            var
                html = $('<div><div class="a">Hello World!</div></div>');
                element = html.find('.a')
                ;

            element.translate({
                source: 'en',
                target: 'de',
                progressIndicator: $('<div>MyProgressIndicator</div>')
            });

            expect(element.prev().text()).toEqual('MyProgressIndicator');

            mostRecentAjaxRequest().response({
                status: 200,
                responseText: '{"data": {"translations": [{"translatedText": "Hallo Welt!"}]}}'
            });

            expect(html.text()).toBe('Hallo Welt!');
        });

        it("it should show and remove a custom progress indicator html", function() {
            var
                html = $('<div><div class="a">Hello World!</div></div>');
                element = html.find('.a')
                ;

            element.translate({
                source: 'en',
                target: 'de',
                progressIndicator: '<div>MyProgressIndicator</div>'
            });

            expect(element.prev().text()).toEqual('MyProgressIndicator');

            mostRecentAjaxRequest().response({
                status: 200,
                responseText: '{"data": {"translations": [{"translatedText": "Hallo Welt!"}]}}'
            });

            expect(html.text()).toBe('Hallo Welt!');
        });

        it("it should fire an onComplete event", function() {
            var
                html = $('<div><div class="a">Hello World!</div></div>');
                element = html.find('.a')
                ;

            element.translate({
                source: 'en',
                target: 'de',
                onComplete: function() {
                    element.text(element.text() + ' Done!');
                }
            });

            mostRecentAjaxRequest().response({
                status: 200,
                responseText: '{"data": {"translations": [{"translatedText": "Hallo Welt!"}]}}'
            });

            expect(html.text()).toBe('Hallo Welt! Done!');
        });
    });

});
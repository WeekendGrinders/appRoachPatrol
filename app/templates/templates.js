App.templates = {};

App.templates.main = _.template(
    '<ul><li><h1>{{ name }}</h1><br><h2>Style: {{style}}</h2></li></ul>'
);

App.templates.list = _.template(
    '<li><h1>{{ name }}</h1><br><h2>Score: {{score}}</h2><br><h2>Style: {{style}}</h2></li>'
);

App.templates.restaurant = _.template(
    '<h1>{{ name }}</h1><br><h2>Score: {{score}}</h2><br><h2>Style: {{style}}</h2>'
);

App.templates.map = _.template(
    '<ul><li><h1>{{ name }}</h1><br><h2>Style: {{style}}</h2></li></ul>'
);

App.templates.detail = _.template(
    '<ul><li><h1>{{ name }}</h1><br><h2>Style: {{style}}</h2></li></ul>'
);

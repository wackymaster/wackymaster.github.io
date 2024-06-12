---
layout: page
title: Coursework
permalink: /coursework/
description: 
nav: true
nav_order: 3
display_categories: [work, fun]
horizontal: false
---

<article>

  <hr>
  <h2>Teaching</h2>
  {% for course in site.data.coursework_taught %}
    {% include class.liquid title=course.title description=course.description %}
  {% endfor %}

  <hr>
  <h2>Selected Coursework</h2>
  {% for category in site.data.coursework_taken %}
    <p>
    <h5 class="font-weight-bold"> {{ category.title }} </h5>
    {% for course in category.contents %}
      {% include class.liquid title=course.title description=course.description %}
    {% endfor %}
    </p>
  {% endfor %}

</article>
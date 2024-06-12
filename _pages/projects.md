---
layout: page
title: Projects
permalink: /projects/
# description: A collection of some of the projects I am working on have worked on in the past
nav: true
nav_order: 2
display_categories: [ongoing, previous]
use_header: true
horizontal: true
---

<!-- pages/projects.md -->
<div class="projects">

<!-- Display categorized projects -->

{% for category in page.display_categories %}

  <h3 class="category">{{ category }}</h3>
  {% assign categorized_projects = site.projects | where: "category", category %}
{% assign sorted_projects = categorized_projects | sort: "importance" %}
<!-- Generate cards for each project -->
{% if page.horizontal %}
<div class="container">
  <div class="row row-cols-1 row-cols-md-2">
  {% for project in sorted_projects %}
    {% include projects_horizontal.liquid %}
  {% endfor %}
  </div>
</div>
{% else %}
<div class="row row-cols-1 row-cols-md-3">
  {% for project in sorted_projects %}
    {% include projects.liquid %}
  {% endfor %}
</div>
{% endif %}
{% endfor %}

</div>

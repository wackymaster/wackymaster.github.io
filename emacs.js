window.addEventListener('resize', draw_emacs);

window.addEventListener('load', draw_emacs);


function draw_emacs() {
  var content = document.getElementById("mytxt");
  content.innerHTML = "";
  width = Math.max(screen.width / 2, 500);
  height = "auto";

  var topImage = new Image(width, 200);
  topImage.style.height = "auto";
  topImage.src = 'images/top.png';
  var content = document.getElementById("mytxt");
  content.appendChild(topImage);


  var defaultString = "\n public class WilliamWang extends Developer { \n \n \t String fullName = \"William Wang\"; \n \t String degree = \"Bachelors in Computer Science and Physics\"; \n \t  String education = \"Cornell University 2024\"; \n \t  int startProgrammingYear = 2011; \n \t  \n \t  HashMap &lt;String, Integer&gt; languageYears = new HashMap &lt;String, Integer&gt;(); \n \t  languageYears.put(\"Python\", 6); \n \t  languageYears.put(\"Fortran\", 5); \n \t  languageYears.put(\"Java\", 4); \n \t  languageYears.put(\"OCaml\", 2); \n \t  languageYears.put(\"C++\", 2); \n \t  languageYears.put(\"C\", 2); \n \t  \n \t  public URL getProjects(){ \n \t \t return new URL(\"williamywang.com/projects.html\"); \n \t  } \n \t  \n \t  public URL learnAboutMe(){ \n \t \t return new URL(\"williamywang.com/about.html\"); \n \t  } \n \t  \n \t  public URL myResearch(){ \n \t \t return new URL(\"williamywang.com/research.html\"); \n \t  } \n } \n "
  var x = document.getElementById("mytxt");
  x.value = defaultString;

  const color_map = new Map();
  keywords = ["class", "public", "extends", "new", "return"];
  keyword_color = "#aa38f2";
  types = ["String", "int", "Integer", "HashMap", "URL", "WilliamWang", "Developer"]
  type_color = "#7bac7b";

  for (var i = 0; i < keywords.length; i++) {
    color_map.set(keywords[i], keyword_color);
  }
  for (var i = 0; i < types.length; i++) {
    color_map.set(types[i], type_color);
  }

  var color;
  var words = defaultString.split(" ");
  for (var i = 0; i < words.length; i++) {
    var span = document.createElement('span');
    span.innerHTML = words[i] + " ";
    if (words[i].includes("\n")) {
      span.innerHTML += "<br> ";
    }
    if (words[i].includes("\t")) {
      span.style.marginLeft = "20px";
    }
    if (color_map.has(words[i])) {
      color = color_map.get(words[i])
    }
    else {
      color = "black"
    }
    span.style.fontSize = "min(1vw, 10px);";
    span.style.color = color;
    x.appendChild(span);
  }
  var fontSize = 12;
  x.style.fontSize = "min(1vw, " + String(fontSize) + "px);";
  x.style.width = String(width);


  document.body.appendChild(x);

  var bottomImage = new Image(width, 200);
  bottomImage.style.height = "auto";
  bottomImage.src = 'images/bottom.png';
  var content = document.getElementById("mytxt");
  content.appendChild(bottomImage);
  bottomImage.style.zIndex = "-1000";
  content.style.alignItems = "center";
}

draw_emacs();


var example = ['JAVA', 'OCAML', 'PYTHON', 'FORTRAN', 'C++', 'LaTeX',
  'C', 'Javascript', 'MATLAB'];
var duration = 3;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


function textSequence(num) {

  setTimeout(function () {
    i = getRandomInt(example.length);
    while (i == num) {
      i = getRandomInt(example.length);
    }
    $('#sequence').fadeOut(1000, function () {
      document.getElementById("sequence").innerHTML = "Code with " + example[i];
      $('#sequence').fadeIn(500);
    });

    textSequence(i);
  }, 1000 * duration);


}

textSequence(0);

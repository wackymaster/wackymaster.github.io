
var example = ['JAVA', 'OCAML', 'PYTHON', 'FORTRAN', 'C++', 'LaTeX',
  'C', 'Javascript', 'RISC-V', 'ASSEMBLY', 'MATLAB'];
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
    $('#sequence').animate({ fontSize: '.1em' }, function () {

      document.getElementById("sequence").innerHTML = example[i];
      $('#sequence').animate({ fontSize: '1em' }, "slow");
    });

    textSequence(i);
  }, 1000 * duration);


}

textSequence(0);

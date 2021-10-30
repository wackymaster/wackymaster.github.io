public class WilliamWang extends Developer {

    String fullName = "William Wang";
    String degree = "Bachelors in Computer Science and Physics";
    String education = "Cornell University 2024";
    int startProgrammingYear = 2011;

    HashMap<String, Integer> languageYears = new HashMap<String, Integer>();
    languageYears.put("Python", 6);
    languageYears.put("Fortran", 5);
    languageYears.put("Java", 4);
    languageYears.put("OCaml", 2);
    languageYears.put("C++", 2);
    languageYears.put("C", 2);
    
    
    public URL getProjects(){
	return new URL("williamywang.com/projects.html");
    }

    public URL learnAboutMe(){
	return new URL("williamywang.com/about.html");
    }

    public URL myResearch(){
	return new URL("williamywang.com/research.html");
    }

}

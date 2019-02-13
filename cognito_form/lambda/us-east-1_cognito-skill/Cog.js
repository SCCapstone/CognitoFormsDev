class Cog{

   static yesNo(formAns){

      if(formAns =="yes"){
          formAns="true";
      }
      else if(formAns == "no"){
           formAns="false";
      }

       return formAns;
    }

   static checkBoxes(formAns){
       var temp = formAns;
       formAns= '["'+ temp +'"]';

       return formAns;

   }

   static time(formAns){              //13:00:00

       return formAns+= ":00";

   }



}
module.exports= Cog;

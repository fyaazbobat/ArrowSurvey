// IIFE -- Immediately Invoked Function Expression
(function(){

    function Start()
    {
        console.log("App Started...");

        let deleteButtons = document.querySelectorAll('.btn-danger');
        
        for(button of deleteButtons)
        {
            button.addEventListener('click', (event)=>{
                if(!confirm("Are you sure?")) 
                {
                    event.preventDefault();
                    window.location.assign('/survey');
                }
            });
        }
    }

    window.addEventListener("load", Start);

})();
function convert_HTML_PDF()
{
    var doc = new jsPDF();
    let elementHTML = $('#content').html();
    let specialElementHandalers = {
        '#elementH': function(element, renderer){
            return true;
        }
    };


doc.fromHTML(elementHTML,15,15, {
'width':170,
'elementHandlers': specialElementHandalers

});

doc.save('Survey-Answer.pdf');
}

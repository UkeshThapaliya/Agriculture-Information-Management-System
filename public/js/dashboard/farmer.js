$(document).ready(function () {
    $('#example').DataTable();
});

const actionBtn = document.querySelectorAll('.action-menu i');

for (var i = 0; i < actionBtn.length; i++) {
    actionBtn[i].addEventListener('click', function(event){
        this.nextElementSibling.classList.toggle('show');
    });
};
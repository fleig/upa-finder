from django.shortcuts import render
from models import google_places

# Create your views here.
def index(request):
    var1 = google_places()
    var1.get_psfs_nearby()
    
    var2 = var1.ret_psf()
    
    meu_dict = {
        'lista': var2
    }
    return render(request, 'index.html', meu_dict)
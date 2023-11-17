var selected = null, // Object of the element to be moved
    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
    x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element


var outer_div_width = 0,
    inner_div_width = 0,

    outer_div_height = 0,
    inner_div_height = 0;

var profileUploadObj = '';
var dimension = {};




var imageWidth = 0,
    imageHeight = 0;



$(function () {

    var saveOrCancel = $('.save-or-cancel');
    var setting = $('.setting');


    $('.coverImage').change(function () {
        var fileList = $(this).prop('files');
        console.log(fileList);
        profileUploadObj = UploadFile('coverphoto', fileList[0]);
        profileUploadObj.fetchMeta(initUpload, profileUploadObj);
        saveOrCancel.show();
        setting.hide();
    });


    function initUpload(res, upObj) {

        console.log('inside initUpload function : ', res);
        console.log('image names:::::::::::', upObj.getName());
        var meta = {
            'name': upObj.getName(),
            'previewUrl': upObj.getPreview(),
            'id': portalUtils.getUniqueId('uploadProgress')
        };
        setImage(meta);
        $('#draggable-element-cover').mousemove(_move_elem);
        $(document).mouseup(function () {
            _destroy(upObj);
        });
    }

    function _drag_init(elem) {

        // Store the object of the element which needs to be moved
        selected = elem;
        x_elem = x_pos - selected.offsetLeft;
        y_elem = y_pos - selected.offsetTop;

    }

// Will be called when user dragging an element
    function _move_elem(e) {
        x_pos = document.all ? window.event.clientX : e.pageX;
        y_pos = document.all ? window.event.clientY : e.pageY;

        if (selected !== null) {
            if ((-(inner_div_width - outer_div_width)) <= (x_pos - x_elem) && ((x_pos - x_elem) < 0)) {
                selected.style.left = (x_pos - x_elem) + 'px';
            }

            if ((-(inner_div_height - outer_div_height)) <= (y_pos - y_elem) && ((y_pos - y_elem) < 0)) {
                selected.style.top = (y_pos - y_elem) + 'px';
            }
        }
    }

// Destroy the object when we are done
    function _destroy(upObj) {

        var p = $('#draggable-element-cover').position();

        var x = p.left ? p.left : 0,
            y = p.top ? p.top : 0;
        dimension = {

            //'ih': 250,
            //'iw': 700,

            'ih': imageHeight,
            'iw': imageWidth,

            'cimX': Math.abs(parseInt(x, 10)),
            'cimY': Math.abs(parseInt(y, 10))
        };



        console.log(dimension);



        upObj.setRepositionData(dimension);
        selected = null;
    }

    function setImage(meta) {
        var imageSrc = meta.previewUrl;
        var draggable_element = $('#draggable-element-cover');
        draggable_element.show();
        var outerDiv = $("#image-div-holder");

        // draggable_element.style.backgroundImage = 'url('+meta.previewUrl+')';
        draggable_element.css('background-image', 'url(' + imageSrc + ')');
        draggable_element.css('cursor', 'move');

        var image = new Image();
        image.src = imageSrc;

        imageWidth = image.width;
        imageHeight = image.height;

        draggable_element.css("width", image.width + "px");
        draggable_element.css("height", image.height + "px");


        outer_div_width = outerDiv.width();
        inner_div_width = draggable_element.width();

        outer_div_height = outerDiv.height();
        inner_div_height = draggable_element.height();


        if (inner_div_height >= outer_div_height || inner_div_width >= outer_div_width) {
            draggable_element.mousedown(function () {
                _drag_init(this);
                return false;
            });
        }
        else {
            // alert('Image size must be bigger then the viewport');
        }
    }
    
    $('#cancelSaveCoverImage').click(function () {
        // alert('click');
        var dragable = $('#draggable-element-cover');
        $(document).unbind('mouseup');
        dragable.unbind('mousemove');
        dragable.unbind('mousedown');
        saveOrCancel.hide();
        dragable.hide();
        // portalUtils.setUserDetailsToUI();
        setting.show();
    });

    $('#saveCoverImage').click(function () {
        var dragable = $('#draggable-element-cover');
        $(document).unbind('mouseup');
        dragable.unbind('mousemove');
        dragable.unbind('mousedown');

        swal({
            title: 'Cover image changing..',
            type: 'info',
            html: 'Please wait while changing cover photo ',
            allowEscapeKey:false,
            allowOutsideClick:false
        });
        swal.enableLoading();

        profileUploadObj.initUpload(uploadProgress).then(function (response) {
            console.log('upload response');
            console.log(response);
            if (response.sucs) {
                setCoverPhoto(response.iurl);
            }
        });
    });


    function uploadProgress(progress, fileName) {
        console.log('progress:::::::::::', progress);
    }

    function setCoverPhoto(url) {
        console.log('set cover photo request ::::::::::::::::');
        var payload = {
            actn: OPERATION_TYPES.SYSTEM.PROFILE.TYPE_CHANGE_COVER_PIC,
            cimX: dimension.cimX,
            cimY: dimension.cimY,
            ih: dimension.ih,
            iw: dimension.iw,
            iurl: url,
            type: 1,
            imT: 3,
            uId: portalUtils.StorageFactory.getCookie('uId'),
            dvc: 5,
            // wmfc : false,
            pckId: portalUtils.getUniqueId()
        };

        return $$connector.request(payload, OPERATION_TYPES.SYSTEM.REQUEST_TYPE.UPDATE).then(function (json) {
            console.log('cover image response!!!!!!!', json);
            if (json.sucs) {
                StorageFactory.removeCookie('cIm');
                portalUtils.getUserProfileDetails();
                saveOrCancel.hide();
                setting.show();
                // swal.close();
                swal({
                    title: 'Great',
                    type: 'success',
                    text: 'Cover photo updated successfully',
                    timer: 3000
                })
            }
        })
    }
});

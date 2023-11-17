/**
 * Created by ishrak on 6/4/16.
 */
var selected = null, // Object of the element to be moved
    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
    x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element


var outer_div_width = 0,
    inner_div_width = 0,

    outer_div_height = 0,
    inner_div_height = 0;

var profileUploadObj = '';
var dimension = {};


$(function () {

     var saveOrCancel = $('.save-or-cancel-profile');
    //var setting = $('.setting');


    $('.profileImage').change(function () {
        var fileList = $(this).prop('files');
        console.log('FILE LIST :::::::::::::::::::::::' ,fileList);
        profileUploadObj = UploadFile('profilephoto', fileList[0]);
        profileUploadObj.fetchMeta(initUpload, profileUploadObj);


        saveOrCancel.show();
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
        $('#draggable-element-profile').mousemove(_move_elem);
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

        var p = $('#draggable-element-profile').position();
        var x = p.left ? p.left : 0,
            y = p.top ? p.top : 0;
        dimension = {
            'ih': 250,
            'iw': 700,
            'cimX': Math.abs(parseInt(x, 10)),
            'cimY': Math.abs(parseInt(y, 10))
        };
        upObj.setRepositionData(dimension);
        selected = null;
    }

    function setImage(meta) {
        var imageSrc = meta.previewUrl;
        var draggable_element = $('#draggable-element-profile');
        draggable_element.show();

        var outerDiv = $(".profile-pic");

        // draggable_element.style.backgroundImage = 'url('+meta.previewUrl+')';
        draggable_element.css('background-image', 'url(' + imageSrc + ')');
        draggable_element.css('cursor', 'move');

        var image = new Image();
        image.src = imageSrc;

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
            alert('Image size must be bigger then the viewport');
        }
    }


    $('#cancelSaveProfileImage').click(function () {
        var dragable = $('#draggable-element-profile');
        $(document).unbind('mouseup');
        dragable.unbind('mousemove');
        dragable.unbind('mousedown');
        saveOrCancel.hide();
        dragable.hide();
        // setting.show();
    });

    $('#saveProfileImage').click(function () {
        var dragable = $('#draggable-element-profile');
        $(document).unbind('mouseup');
        dragable.unbind('mousemove');
        dragable.unbind('mousedown');

        swal({
            title: 'Profile image changing..',
            type: 'info',
            html: 'Please wait while changing profile photo ',
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
            actn: OPERATION_TYPES.SYSTEM.PROFILE.TYPE_CHANGE_PROFILE_PIC,
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
            console.log('Profile image response!!!!!!!', json);
            if (json.sucs) {
                StorageFactory.removeCookie('prIm');
                portalUtils.getUserProfileDetails();
                saveOrCancel.hide();
                //setting.show();
                // swal.close();
                swal({
                    title: 'Great',
                    type: 'success',
                    text: 'Profile photo updated successfully',
                    timer: 3000
                })
            }
        })
    }
});

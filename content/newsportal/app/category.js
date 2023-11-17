$(function () {
    catModule.populateTypeList();
    catModule.populateCategoryList();

    var categoryNameContainer = $('#categoryName');
    var typeSelectContainer = $('#typeSelect');
    var categoryTable = $('#categoryTable > tbody');
    var submitCategory = $('#submitCategory');
    var categoryForm = $('#categoryForm');
    var categoryFormAdd = $('#categoryFormAdd');


    if (categoryFormAdd) {
        categoryFormAdd.click(function () {
            resetCategoryForm();
            submitCategory.val('Add');
            categoryForm.fadeIn('slow');
        })
    }

    function resetCategoryForm() {
        categoryNameContainer.val('');
        categoryNameContainer.data('catid', '');
        typeSelectContainer.val('');
    }

    function resetAndHideCategoryForm() {
        resetCategoryForm();
        categoryForm.fadeOut('slow');
    }

    if (categoryTable) {
        categoryTable.on('click', 'a.deleteCategory', function () {
            var catId = $(this).data('catId');
            var tr = $(this).closest('tr');
            console.log(tr);

            swal({
                title: 'Are you sure?',
                text: 'You will not be able to recover this',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it'
            }).then(function (isConfirm) {
                if (isConfirm === true) {
                    swal({
                        title: 'Category Delete',
                        type: 'info',
                        text: 'Please wait while category delete completed',
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    });
                    swal.enableLoading();
                    catModule.deleteCategory(catId).then(function (json) {
                        if (json.sucs) {
                            catModule.removeCatFromStorage(catId);
                            tr.css("background-color", "#FF3700");
                            tr.fadeOut(400, function () {
                                tr.remove();
                                swal(
                                    'Deleted!',
                                    'Category has been deleted.',
                                    'success'
                                );
                            });
                        }
                        else {
                            swal(
                                'Error',
                                json.msg || 'Something wrong,please try again later',
                                'error'
                            );
                        }
                    });

                } else if (isConfirm === false) {
                    swal(
                        'Cancelled',
                        'Your Category is safe :)',
                        'error'
                    );
                }
            });
        });
        categoryTable.on('click', 'a.editCategory', function () {
            resetCategoryForm();
            submitCategory.val('Update');
            categoryForm.fadeIn('slow');
            // return false;
            var catId = $(this).data('catId');
            var catName = $(this).data('catName');
            var typeId = $(this).data('typeId');
            categoryNameContainer.val(catName);
            categoryNameContainer.data('catId', catId);
            typeSelectContainer.val(typeId);

        });
    }

    categoryForm.validate({
        submitHandler: function (form) {
            submitCategoryForm();
        },
        rules: {
            categoryName: {required: true},
            typeSelect: {required: true}
        },
        messages: {
            typeSelect: {
                required: 'Type is required'
            },
            categoryName: {
                required: 'Category name is required'
            }
        }
    });


    function submitCategoryForm() {
        var val = submitCategory.val();
        var name = categoryNameContainer.val();
        var typeId = typeSelectContainer.val();
        var catId = categoryNameContainer.data('catId');

        switch (val) {
            case 'Add':
                swal({
                    title: 'Are you sure to Add?',
                    text: 'Later you can update it as many times you want!',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, Add it!',
                    cancelButtonText: 'No, I don\'t'
                }).then(function (isConfirm) {
                    if (isConfirm === true) {
                        swal({
                            title: 'Category Add',
                            type: 'info',
                            text: 'Please wait while category add completed',
                            allowEscapeKey: false,
                            allowOutsideClick: false
                        });
                        swal.enableLoading();
                        catModule.addCategory(name, typeId).then(function (json) {
                            if (json.sucs) {
                                // StorageFactory.deleteData('catList');
                                // catModule.callTypeCategoryList();
                                var itemId = json.id ;
                                catModule.addCatToStorage(name,itemId,typeId);
                                var tr = '<tr><td>' + name + '</td>' +
                                    '<td>' + catModule.getTypeNameFromId(typeId) + '</td>' +
                                    '<td><a href=""><a data-type-id="' + typeId + '" data-cat-name="' + name + '" data-cat-id=""  data-tool="Edit" class="editCategory top-r"><img src="images/edit.png"/></a>' +
                                    '<a data-cat-id=""  class="deleteCategory top-r"  data-tool="Delete"><img src="images/delete.png"/></a></td></tr>';
                                categoryTable.prepend(tr).fadeIn('slow');
                                swal(
                                    'Add successful!',
                                    'Category has been added.',
                                    'success'
                                );
                            } else {
                                swal(
                                    'Error',
                                    json.msg || 'Something wrong,please try again later',
                                    'error'
                                );
                            }
                        });
                    }
                    resetAndHideCategoryForm();
                });

                break;
            case 'Update':

                swal({
                    title: 'Are you sure to update?',
                    text: 'Later you can update it as many times you want!',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, update it!',
                    cancelButtonText: 'No, keep it'
                }).then(function (isConfirm) {
                    if (isConfirm === true) {
                        swal({
                            title: 'Category update',
                            type: 'info',
                            text: 'Please wait while category update completed',
                            allowEscapeKey: false,
                            allowOutsideClick: false
                        });
                        swal.enableLoading();
                        catModule.updateCategory(name, catId, typeId).then(function (json) {
                            if (json.sucs) {
                                // StorageFactory.deleteData('catList');
                                // catModule.callTypeCategoryList();
                                catModule.updateCatToStorage(name, catId, typeId);
                                var td = categoryTable.find("[data-cat-id='" + catId + "']").closest('td');
                                var typeName = catModule.getTypeNameFromId(typeId);
                                td.prev().text(typeName);
                                td.prev().prev().text(name);
                                swal(
                                    'Update successful!',
                                    'Category has been updated.',
                                    'success'
                                );
                            } else {
                                swal(
                                    'Error',
                                    json.msg || 'Something wrong,please try again later',
                                    'error'
                                );
                            }
                        });


                    } else if (isConfirm === false) {
                        swal(
                            'Update cancelled',
                            'Your Category stays at it was',
                            'info'
                        );
                    }
                    resetAndHideCategoryForm();
                });

        }
    }

});
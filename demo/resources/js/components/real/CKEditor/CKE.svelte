<svelte:options
        customElement={{
        tag: "ck-editor",
		shadow: 'none',
		props: {

		}
    }}
/>
<script>
    import { onMount, onDestroy } from 'svelte';

    import { ClassicEditor, Essentials, Bold, Italic, Font, Paragraph, List, AutoLink, Link } from 'ckeditor5';
    //import { FormatPainter } from 'ckeditor5-premium-features';

    import 'ckeditor5/ckeditor5.css';
    /*import 'ckeditor5-premium-features/ckeditor5-premium-features.css';*/

    let editorContainer;
    let editorInstance = null;

    export let field_id="remarks"
    export let editorHeight = 50;
    export let text=""

    onMount( () => {
        console.log('CKE::Mount::text:',text)
        ClassicEditor
            .create( editorContainer, {
                licenseKey: 'GPL', // Replace with your license key or 'GPL'
                plugins: [ Essentials, Bold, Italic, Font, Paragraph, List, Link, AutoLink /*FormatPainter*/ ],
                toolbar: [
                    'undo', 'redo', '|', 'bold', 'italic', '|',
                    'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|', 'numberedList', 'bulletedList', 'link', '|'
                    /*,'formatPainter'*/
                ]
            } )
            .then( editor => {
                editorInstance = editor;
                editor.ui.view.editable.element.style.height = `${editorHeight}px`;;
                editor.setData(text); // <-- тук сетваш текста
                //console.log('CKE::Mount::text set:', text);

                // Listen for content changes and update 'text'
                editor.model.document.on('change:data', () => {
                    text = editor.getData(); // Update 'text' variable with the editor content
                    //console.log('Updated text:', text); // Optionally log the updated content
                });
            } )
            .catch( error => {
                console.error( 'Error initializing CKEditor:', error );
            } );

    } );

    onDestroy( () => {
        if ( editorInstance ) {
            editorInstance.destroy().catch( err => console.error( err ) );
        }
    } );
</script>

<textarea bind:this={editorContainer} id="{field_id}" name="{field_id}" class="ckeditor5">

</textarea>

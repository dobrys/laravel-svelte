<svelte:options
        customElement={{
        tag: "ck-editor-adv",
		shadow: 'none',
		props: {
            pluginsNames: { type: 'Array'}
		}
    }}
/>
<script>
    import { onMount, onDestroy } from 'svelte';
    import * as CKEditor5 from 'ckeditor5'; // <-- Импортираме ВСИЧКО
    import { ClassicEditor } from 'ckeditor5';

    import 'ckeditor5/ckeditor5.css';

    let editorContainer;
    let editorInstance = null;

    export let field_id = "remarks";
    export let text = "";
    export let pluginsNames = ['Essentials', 'Bold', 'Italic', 'Font', 'Paragraph']; // <-- Приемаш имена
    export let toolbar = [
        'undo', 'redo', '|', 'bold', 'italic', '|',
        'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor'
    ];
    export let config = {};

    let plugins = [];

    onMount(() => {
        console.log('pluginsNames:',typeof pluginsNames);
        console.log('pluginsNames:',pluginsNames);
        if (!text) {
            text = `<p><b>Hello</b> from Advanced CKEditor 5! attached to '${field_id}'</p>`;
        }

        console.log('CKE::Mount::text:', text);

        // Генериране на plugins масива по имена
        plugins = pluginsNames.map(name => CKEditor5[name]).filter(Boolean);

        ClassicEditor
            .create(editorContainer, {
                licenseKey: 'GPL',
                plugins,
                toolbar,
                ...config
            })
            .then(editor => {
                editorInstance = editor;
                editor.setData(text);
                console.log('CKE::Mount::text set:', text);
            })
            .catch(error => {
                console.error('Error initializing CKEditor:', error);
            });
    });

    onDestroy(() => {
        if (editorInstance) {
            editorInstance.destroy().catch(err => console.error(err));
        }
    });
</script>

<textarea bind:this={editorContainer} id={field_id} name={field_id} class="ckeditor5"></textarea>


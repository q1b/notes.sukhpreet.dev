<template>
    <EditorContent :class="{ 'animate-pulse': loading }" :editor="editor" />
    <SparklesIcon class="w-6 h-6 absolute top-10 right-10 text-slate-800" :class="{ 'animate-pulse': saving }" />
</template>

<script setup lang="ts">
import { SparklesIcon } from "@heroicons/vue/20/solid"
import Document from '@tiptap/extension-document'
import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import { lowlight } from "lowlight/lib/core";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import css from "highlight.js/lib/languages/css";
import go from "highlight.js/lib/languages/go";
import c from "highlight.js/lib/languages/c";
import dart from "highlight.js/lib/languages/dart";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { useEditor, EditorContent, Content } from "@tiptap/vue-3";
import { watchDebounced } from "@vueuse/core";

lowlight.registerLanguage("html", html);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("ts", ts);
lowlight.registerLanguage("go", go);
lowlight.registerLanguage("dart", dart);
lowlight.registerLanguage("c", c);

const body = defineModel<string>();
const saving = ref(false);
const loading = ref(false);

const collection = useCollection();
const collections = useCollections();


const CustomDocument = Document.extend({
    content: 'heading block*',
})

let editor = useEditor({
    content: body.value,
    extensions: [
        CustomDocument,
        StarterKit.configure({
            document: false,
            // disable extension as it's already present in CodeBlockLowlight
            codeBlock: false,
        }),
        Placeholder.configure({
            placeholder: ({ node }) => {
                if (node.type.name === 'heading') {
                    return 'What\'s the title?'
                }

                return 'Can you add some further context?'
            },
        }),
        Typography,
        TaskList.configure({
            HTMLAttributes: {
                class: "flex flex-col space-y-2",
            },
        }),
        TaskItem.configure({
            nested: true,
        }),
        Highlight.configure({
            HTMLAttributes: {
                class: "inline-block px-2 rounded-lg selection:bg-indigo-800 bg-indigo-500 text-white ",
            },
        }),
        Link,
        CodeBlockLowlight.configure({
            lowlight,
        }),
    ],
    onCreate: () => {
        const index = +`${window.localStorage.getItem('active_collection_index')}` ?? 0 as number;
        if (collections.value[index]?.content === undefined || collections.value[index].content === 'Content ...') {
            loading.value = true
            $fetch(`/collections/data/${collection.value.id}`).then((res) => {
                if (res?.content) {
                    collections.value[index].content = res.content;
                    editor.value?.commands.setContent(collections.value[index].content as Content, false);
                }
                loading.value = false
            })
        } else {
            editor.value?.commands.setContent(collections.value[index].content as Content, false);
        }
    },
    onUpdate: ({ editor }) => {
        body.value = editor?.getHTML();
    },
    editorProps: {
        attributes: {
            class: "prose dark:prose-invert max-w-none overflow-x-auto prose-slate focus:outline-none min-h-screen",
        },
    },
});

// Whenever Content Change it runs
// watch(() => collections.value[collection.value.index].content, (v) => {
//     console.log("Updating whenever the content changes");
//     editor.value?.commands.setContent(v as Content, false);
// })

// When our Tab Changes
watch(() => collection.value.index, async () => {
    if (collections.value[collection.value.index]?.content === undefined || collections.value[collection.value.index].content === 'Content ...') {
        loading.value = true
        const res = await $fetch(`/collections/data/${collection.value.id}`)
        if (res?.content) {
            collections.value[collection.value.index].content = res.content
            editor.value?.commands.setContent(collections.value[collection.value.index].content as Content, false);
        }
        loading.value = false
    } else {
        editor.value?.commands.setContent(collections.value[collection.value.index].content as Content, false);
    }
});

// Runs only when index changes
watchDebounced(() => collections.value[collection.value.index]?.content, (v, p) => {
    if (p !== undefined)
        $fetch(`/collections/data/${collection.value.id}`, {
            method: 'PUT',
            body: v,
        }).then(() => {
            console.log("Succefully updated content", v);
            saving.value = false
        }).catch((err) => {
            console.log("ERROR: ", err)
            saving.value = false;
        })
    if (!editor.value?.isFocused) editor.value?.commands.setContent(v, false);
}, {
    onTrigger: () => saving.value = true,
    debounce: 1000,
})
</script>

<style>
.ProseMirror h1.is-editor-empty:first-child::before {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
}

/* <h1 data-placeholder="What's the title?" class="is-empty is-editor-empty"><br class="ProseMirror-trailingBreak"></h1> */
[type="checkbox"]:checked {
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}

[type="checkbox"]:checked {
    border-color: transparent;
    background-color: currentColor;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
}

[type="checkbox"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    display: inline-block;
    vertical-align: middle;
    background-origin: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    flex-shrink: 0;
    border-radius: 2px;
    height: 1rem;
    width: 1rem;
    color: #2563eb;
    background-color: #fff;
    border-color: #6b7280;
    border-width: 1px;
    --tw-shadow: 0 0 #0000;
}

input {
    font-family: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    color: inherit;
    margin: 0;
    padding: 0;
}

ul[data-type="taskList"] {
    list-style: none;
    padding: 0;
}

ul[data-type="taskList"] label {
    margin: 0;
    display: flex;
}

ul[data-type="taskList"] div {
    margin: 0;
    display: flex;
    align-items: center;
    flex-direction: row;
}

ul[data-type="taskList"] p {
    margin: 0;
}

ul[data-type="taskList"] li {
    display: flex;
    /* background-color: #0002; */
    /* align-items: baseline; */
    max-width: fit-content;
    padding-inline-end: 6px;
    /* padding-block: 2px; */
    border-radius: 10px;
}

ul[data-type="taskList"] li input {
    position: relative;
    top: 6px;
    left: 2px;
}

ul[data-type="taskList"] li>label {
    display: flex;
    flex: 0 0 auto;
    margin-right: 0.5rem;
    user-select: none;
}

ul[data-type="taskList"] li>div {
    margin-top: 0px;
    flex: 1 1 auto;
}

.collaboration-cursor__caret {
    position: relative;
    margin-left: -1px;
    margin-right: -1px;
    border-left: 1px solid #0d0d0d;
    border-right: 1px solid #0d0d0d;
    word-break: normal;
    pointer-events: none;
}

.collaboration-cursor__label {
    position: absolute;
    top: -1.4em;
    left: -1px;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    color: #0d0d0d;
    padding: 0.1rem 0.3rem;
    border-radius: 3px 3px 3px 0;
    white-space: nowrap;
}
</style>
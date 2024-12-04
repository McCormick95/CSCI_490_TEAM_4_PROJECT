import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import PropTypes from 'prop-types';

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={`
      fixed inset-0 z-50 bg-black/80 backdrop-blur-sm
      data-[state=open]:animate-in data-[state=closed]:animate-out
      data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
      ${className || ''}
    `}
        {...props}
    />
))

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={`
        fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%]
        translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg
        duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
        data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]
        data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]
        rounded-lg
        ${className || ''}
      `}
            {...props}
        >
            {children}
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500">
                <Cross2Icon className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPortal>
))

DialogContent.displayName = DialogPrimitive.Content.displayName

DialogContent.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

const DialogHeader = ({
    className,
    ...props
}) => (
    <div
        className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ''}`}
        {...props}
    />
)

DialogHeader.propTypes = {
    className: PropTypes.string,
};

const DialogFooter = ({
    className,
    ...props
}) => (
    <div
        className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ''}`}
        {...props}
    />
)

DialogFooter.propTypes = {
    className: PropTypes.string,
};

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={`text-lg font-semibold leading-none tracking-tight ${className || ''}`}
        {...props}
    />
))

DialogTitle.displayName = DialogPrimitive.Title.displayName

DialogTitle.propTypes = {
    className: PropTypes.string,
};

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={`text-sm text-gray-500 dark:text-gray-400 ${className || ''}`}
        {...props}
    />
))

DialogDescription.displayName = DialogPrimitive.Description.displayName

DialogDescription.propTypes = {
    className: PropTypes.string,
};

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
}
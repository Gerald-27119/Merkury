import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";

interface UploadButtonProps {
    onFileSelect: (files: File[]) => void;
}

export default function ChatUploadFiles({ onFileSelect }: UploadButtonProps) {
    return <div className="flex flex-col"></div>;
}

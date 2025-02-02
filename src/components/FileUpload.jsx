import { useState } from 'react';
import { Button, Input, Stack, useToast, Image } from '@chakra-ui/react';
import supabase from '../supabaseClient';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const toast = useToast();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return;
    setIsUploading(true);

    const { data, error } = await supabase.storage
      .from('Files')
      .upload(`uploads/${file.name}`, file);

    setIsUploading(false);

    if (error) {
      toast({
        title: 'Upload failed',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } else {
      const { publicURL } = supabase.storage
        .from('Files')
        .getPublicUrl(`uploads/${file.name}`);
      setFileUrl(publicURL);
      toast({
        title: 'Upload successful!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Stack direction="row" spacing={2} align="center">
      <Input
        type="file"
        onChange={handleFileChange}
        display="none"
        id="file-input"
      />
      <Button as="label" htmlFor="file-input" colorScheme="teal">
        Choose File
      </Button>
      <Button onClick={uploadFile} isLoading={isUploading} colorScheme="teal">
        Upload
      </Button>
      {fileUrl && <Image src={fileUrl} alt="Uploaded file" boxSize="150px" />}
    </Stack>
  );
}
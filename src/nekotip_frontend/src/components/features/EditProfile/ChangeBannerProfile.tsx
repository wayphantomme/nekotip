import { useState } from 'react';

import Button from '@/components/ui/Button/Button';
import CustomFileInput from '@/components/ui/Input/CustomFIleInput';
import ModalCustom from '@/components/ui/Modal/ModalCustom';
import useUploadImage from '@/hooks/useUploadImage';
import useUser from '@/hooks/useUser';
import useWindowSize from '@/hooks/useWindowSize';
import { useAuthManager } from '@/store/AuthProvider';

const ChangeBannerProfile = () => {
  const { user, updateUser } = useUser();
  const { isMobile } = useWindowSize();
  const {
    preview,
    handleFileChange,
    resetUpload,
    uploadError,
    uploadImage,
    selectedFile,
  } = useUploadImage();
  const { actor } = useAuthManager();

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUploadImage = async () => {
    try {
      setLoading(true);
      const url = await uploadImage();

      if (url && actor) {
        const result = await actor.updateUserProfile({
          bannerPic: [url],
          profilePic: [],
          bio: [],
          categories: [],
          username: [],
          name: [],
          socials: [],
        });

        if ('ok' in result) {
          updateUser(result.ok);
          setOpenModal(false);
        } else {
          console.error('Error updating profile', result.err);
        }
      } else {
        console.error('Error uploading image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-2 flex flex-col gap-2 md:gap-4">
        <h3 className="font-semibold text-subtext md:text-lg">
          Banner Picture
        </h3>
        <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded-t-lg border md:h-full md:min-w-[450px] md:max-w-[900px]">
          <img
            src={user?.bannerPic ?? '/images/banner-default.svg'}
            alt="profile"
            className="max-h-[200px] w-full object-cover"
          />
        </div>
        <Button
          size={isMobile ? 'small' : 'default'}
          className="mt-1 w-fit"
          shadow={false}
          onClick={() => setOpenModal(true)}
        >
          Upload Banner Picture
        </Button>
      </div>
      {/* CHANGE BANNER MODAL */}
      <ModalCustom
        title="Upload Banner Picture"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        className="max-w-[450px]"
        disableClose={loading}
      >
        <div className="flex flex-col items-center gap-4 p-5">
          <div className="h-full w-full overflow-hidden rounded-t-lg border bg-bg md:w-[400px]">
            <img
              src={preview || user?.bannerPic || '/images/banner-default.svg'}
              alt="bannerpic"
              className="h-full w-full object-cover"
            />
          </div>
          <CustomFileInput
            onChange={handleFileChange}
            value={selectedFile}
            error={uploadError}
            accept="image/png,image/jpeg,image/gif"
            containerClassName="w-fit"
            className="!bg-transparent"
            handleRemove={resetUpload}
          />
          <Button
            disabled={selectedFile === null || loading}
            className="w-full"
            onClick={handleUploadImage}
          >
            {loading ? 'Uploading...' : 'Save'}
          </Button>
        </div>
      </ModalCustom>
    </>
  );
};

export default ChangeBannerProfile;
